import React from 'react';
import EditTable from 'slate-edit-table';
import debug from 'debug';
import GridOn from '@material-ui/icons/GridOn';
import TableToolbar from './table-toolbar';
import PropTypes from 'prop-types';
import SlatePropTypes from 'slate-prop-types';
import { withStyles } from '@material-ui/core/styles';
const log = debug('@pie-lib:editable-html:plugins:table');

const Table = withStyles(theme => ({
  table: {
    borderCollapse: 'collapse'
  }
}))(props => (
  <table
    className={props.classes.table}
    {...props.attributes}
    border={props.node.data.get('border')}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
  >
    <tbody>{props.children}</tbody>
  </table>
));

Table.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  node: SlatePropTypes.Node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

const TableRow = props => <tr {...props.attributes}>{props.children}</tr>;

TableRow.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

const TableCell = withStyles(theme => ({
  td: {
    border: `solid 1px ${theme.palette.primary.main}`
  }
}))(props => {
  const Tag = props.node.data.get('header') ? 'th' : 'td';

  return (
    <Tag
      {...props.attributes}
      colSpan={props.node.data.get('colspan')}
      className={props.classes[Tag]}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </Tag>
  );
});

TableCell.propTypes = {
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default opts => {
  const core = EditTable({
    typeContent: 'div'
  });

  core.toolbar = {
    icon: <GridOn />,
    onClick: (value, onChange) => {
      log('insert table');
      const c = core.changes.insertTable(value.change(), 2, 2);
      onChange(c);
    },
    supports: (node, value) =>
      node && node.object === 'block' && core.utils.isSelectionInTable(value),
    customToolbar: (node, value, onToolbarDone) => {
      const addRow = () => {
        const change = core.changes.insertRow(value.change());
        onToolbarDone(change, false);
      };

      const addColumn = () => {
        const change = core.changes.insertColumn(value.change());
        onToolbarDone(change, false);
      };

      const removeRow = () => {
        const change = core.changes.removeRow(value.change());
        onToolbarDone(change, false);
      };

      const removeColumn = () => {
        const change = core.changes.removeColumn(value.change());
        onToolbarDone(change, false);
      };

      const removeTable = () => {
        const change = core.changes.removeTable(value.change());
        onToolbarDone(change, false);
      };

      const onDone = () => {
        log('[onDone] call onToolbarDone...');
        onToolbarDone(null, true);
      };

      const Tb = () => (
        <TableToolbar
          onAddRow={addRow}
          onRemoveRow={removeRow}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
          onRemoveTable={removeTable}
          onDone={onDone}
        />
      );
      return Tb;
    }
  };

  core.renderNode = props => {
    switch (props.node.type) {
      case 'table':
        return <Table {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />;
      case 'table_row':
        return <TableRow {...props} />;
      case 'table_cell':
        return (
          <TableCell {...props} onFocus={opts.onFocus} onBlur={opts.onBlur} />
        );
      default:
        return null;
    }
  };

  return core;
};

export const serialization = {
  deserialize(el, next) {
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case 'table': {
        const children =
          el.children.length === 1 &&
          el.children[0].tagName.toLowerCase() === 'tbody'
            ? el.children[0].children
            : el.children;
        const c = Array.from(children);
        return {
          object: 'block',
          type: 'table',
          nodes: next(c),
          data: {
            border: el.getAttribute('border')
          }
        };
      }
      case 'th': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(el.childNodes),
          data: {
            header: true,
            colspan: el.getAttribute('colspan')
          }
        };
      }
      case 'tr': {
        return {
          object: 'block',
          type: 'table_row',
          nodes: next(Array.from(el.children))
        };
      }
      case 'td': {
        return {
          object: 'block',
          type: 'table_cell',
          nodes: next(el.childNodes),
          data: {
            header: false,
            colspan: el.getAttribute('colspan')
          }
        };
      }
    }
  },
  serialize(object, children) {
    if (object.object !== 'block') {
      return;
    }

    switch (object.type) {
      case 'table': {
        return (
          <table border={object.data.get('border')}>
            <tbody>{children}</tbody>
          </table>
        );
      }
      case 'table_row': {
        return <tr>{children}</tr>;
      }
      case 'table_cell': {
        const colspan = object.data.get('colspan');
        if (object.data.get('header')) {
          return <th colSpan={colspan}>{children}</th>;
        } else {
          return <td colSpan={colspan}>{children}</td>;
        }
      }
    }
  }
};