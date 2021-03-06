import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';

import { BasePoint } from '../shared/point';
import BgCircle from './bg-circle';
import { point } from '../../utils';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { rootEdgeComponent } from '../shared/line/with-root-edge';
import ReactDOM from 'react-dom';
import MarkLabel from '../../mark-label';
import isEmpty from 'lodash/isEmpty';
import { color } from '@pie-lib/render-ui';

const opacityPulsate = opacity => ({
  '0%': { opacity: '0.0' },
  '50%': { opacity },
  '100%': { opacity: '0.0' }
});

const getRadius = (from, outer) => {
  const c = point(from);
  return c.dist(point(outer));
};

const equalPoints = (p1, p2) => p1 && p2 && isEqual({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y });

export class RawBaseCircle extends React.Component {
  static propTypes = {
    building: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    from: types.PointType,
    disabled: PropTypes.bool,
    to: types.PointType,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    onClick: PropTypes.func,
    labelNode: PropTypes.object,
    labelModeEnabled: PropTypes.bool,
    changeMarkProps: PropTypes.func
  };

  static defaultProps = {
    onClick: () => ({})
  };

  onChangePoint = point => {
    // because point.from.label and point.to.label can be different
    if (!equalPoints(point.from, point.to)) {
      this.props.onChange(point);
    }
  };

  dragFrom = draggedFrom => {
    const { from, to } = this.props;

    if (from.label) {
      draggedFrom.label = from.label;
    }

    if (!equalPoints(draggedFrom, to)) {
      this.onChangePoint({ from: draggedFrom, to });
    }
  };

  dragTo = draggedTo => {
    const { from, to } = this.props;

    if (to.label) {
      draggedTo.label = to.label;
    }

    if (!equalPoints(from, draggedTo)) {
      this.onChangePoint({ from, to: draggedTo });
    }
  };

  dragCircle = draggedFrom => {
    const { from, to, onChange } = this.props;

    const diff = point(from).sub(point(draggedFrom));
    const draggedTo = point(to).sub(diff);

    if (from.label) {
      draggedFrom.label = from.label;
    }

    if (to.label) {
      draggedTo.label = to.label;
    }

    this.setState(
      {
        draggedroot: undefined,
        draggedOuter: undefined,
        isCircleDrag: false
      },
      () => {
        onChange({ from: draggedFrom, to: draggedTo });
      }
    );
  };

  labelChange = (point, type) => {
    const { changeMarkProps } = this.props;
    const update = { ...point };

    if (!point.label || isEmpty(point.label)) {
      delete update.label;
    }

    changeMarkProps({ [type]: update });
  };

  clickPoint = (point, type) => {
    const { changeMarkProps, from, to } = this.props;

    changeMarkProps({ from, to, [type]: { label: '', ...point } });

    if (this.input[type]) {
      this.input[type].focus();
    }
  };

  // IMPORTANT, do not remove
  input = {};

  render() {
    let {
      from,
      to,
      disabled,
      classes,
      building,
      onDragStart,
      onDragStop,
      onClick,
      correctness,
      graphProps,
      labelNode,
      labelModeEnabled
    } = this.props;

    const common = { onDragStart, onDragStop, graphProps, onClick };

    to = to || from;

    const radius = getRadius(from, to);

    let fromLabelNode = null;
    let toLabelNode = null;

    if (labelNode) {
      if (from && from.hasOwnProperty('label')) {
        fromLabelNode = ReactDOM.createPortal(
          <MarkLabel
            inputRef={r => (this.input.from = r)}
            disabled={!labelModeEnabled}
            mark={from}
            graphProps={graphProps}
            onChange={label => this.labelChange({ ...from, label }, 'from')}
          />,
          labelNode
        );
      }

      if (to && to.hasOwnProperty('label')) {
        toLabelNode = ReactDOM.createPortal(
          <MarkLabel
            inputRef={r => (this.input.to = r)}
            disabled={!labelModeEnabled}
            mark={to}
            graphProps={graphProps}
            onChange={label => this.labelChange({ ...to, label }, 'to')}
          />,
          labelNode
        );
      }
    }

    return (
      <g>
        <BgCircle
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.bgCircleBuilding)}
          x={from.x}
          y={from.y}
          radius={radius}
          onDrag={this.dragCircle}
          {...common}
        />

        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={to.x}
          y={to.y}
          onDrag={this.dragTo}
          {...common}
          onClick={labelModeEnabled ? () => this.clickPoint(to, 'to') : common.onClick}
        />
        {toLabelNode}

        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={from.x}
          y={from.y}
          className={classes.from}
          onDrag={this.dragFrom}
          {...common}
          onClick={labelModeEnabled ? () => this.clickPoint(from, 'from') : common.onClick}
        />
        {fromLabelNode}
      </g>
    );
  }
}

export const BaseCircle = withStyles(theme => ({
  outerLine: {
    fill: 'rgb(0,0,0,0)', // TODO hardcoded color
    stroke: color.primaryLight(),
    strokeWidth: 4,
    '&:hover': {
      strokeWidth: 6,
      stroke: color.primaryDark()
    }
  },
  root: {},
  bgCircleBuilding: {
    stroke: color.secondaryLight(),
    animation: 'opacityPulse 2s ease-out',
    animationIterationCount: 'infinite',
    opacity: 1
  },
  '@keyframes opacityPulse': opacityPulsate('0.3')
}))(RawBaseCircle);

const Component = rootEdgeComponent(BaseCircle);
export default Component;
