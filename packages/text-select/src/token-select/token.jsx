import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

export const TokenTypes = {
  text: PropTypes.string,
  selectable: PropTypes.bool
};

export class Token extends React.Component {
  static rootClassName = 'tokenRootClass';

  static propTypes = {
    ...TokenTypes,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
    correct: PropTypes.bool,
    text: PropTypes.string.isRequired
  };

  static defaultProps = {
    selectable: false,
    text: ''
  };

  render() {
    const {
      text,
      selectable,
      selected,
      classes,
      className: classNameProp,
      disabled,
      index,
      highlight,
      correct
    } = this.props;

    let className;

    if (correct !== undefined) {
      className = classNames(
        Token.rootClassName,
        classes.custom,
        correct === true && classes.correct,
        correct === false && classes.incorrect
      );
    } else {
      className = classNames(
        Token.rootClassName,
        classes.token,
        disabled && classes.disabled,
        selectable && !disabled && classes.selectable,
        selected && !disabled && classes.selected,
        selected && disabled && classes.disabledAndSelected,
        highlight && selectable && !disabled && !selected && classes.highlight,
        classNameProp
      );
    }

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: text }}
        data-indexkey={index}
      />
    );
  }
}

export default withStyles(theme => {
  return {
    token: {
      cursor: 'pointer',
      display: 'inline-block',
      padding: theme.spacing.unit / 2,
      paddingRight: 0,
      transition: 'background-color 100ms ease-in'
    },
    disabled: {
      cursor: 'inherit',
      color: 'grey' // TODO hardcoded color
    },
    disabledAndSelected: {
      backgroundColor: 'pink' // TODO hardcoded color
    },
    selectable: {
      '&:hover': {
        backgroundColor: color.secondaryDark(),
        '& > *': {
          backgroundColor: color.secondaryDark()
        }
      }
    },
    selected: {
      marginTop: theme.spacing.unit / 2,
      '&:hover': {
        backgroundColor: color.secondaryDark()
      },
      backgroundColor: color.secondary(),
      '& > *': {
        backgroundColor: color.secondary()
      }
    },
    highlight: {
      boxSizing: 'border-box',
      marginTop: theme.spacing.unit / 2,
      border: 'dashed 2px gray' //TODO hardcoded color
    },

    custom: {
      display: 'initial'
    },
    correct: {
      backgroundColor: color.correct()
    },
    incorrect: {
      backgroundColor: color.incorrect()
    }
  };
})(Token);
