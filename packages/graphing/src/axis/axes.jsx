import React from 'react';
import { Axis } from '@vx/axis';
import { tickCount } from '../utils';
import { types, utils } from '@pie-lib/plot';
import PropTypes from 'prop-types';
import Arrow from './arrow';
import { withStyles } from '@material-ui/core';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

const log = debug('pie-lib:graphing:axes');

const AxisPropTypes = {
  includeArrows: PropTypes.bool
};
const AxisDefaultProps = {
  includeArrows: true
};

const axisStyles = theme => ({
  line: {
    stroke: theme.palette.primary.main,
    strokeWidth: 5
  },
  arrow: {
    fill: theme.palette.primary.main
  },
  tick: {
    fill: theme.palette.primary.main,
    '& > line': {
      stroke: theme.palette.primary.main
    }
  }
});

const tickLabelStyles = {
  fontFamily: 'Roboto',
  fontSize: '14px',
  cursor: 'inherit'
};

export class RawXAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    classes: PropTypes.object,
    graphProps: types.GraphPropsType.isRequired
  };
  static defaultProps = AxisDefaultProps;

  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return (
      !utils.isDomainRangeEqual(this.props.graphProps, nextProps.graphProps) ||
      !isEqual(data, nextProps.data)
    );
  }
  render() {
    const { includeArrows, classes, graphProps } = this.props;
    const { scale, domain, size } = graphProps;

    return (
      <React.Fragment>
        <Axis
          axisLineClassName={classes.line}
          hideZero={true}
          scale={scale.x}
          numTicks={tickCount(domain.min, domain.max, domain.step)}
          top={scale.y(0)}
          left={0}
          label={domain.label}
          tickClassName={classes.tick}
          tickLabelProps={value => ({
            ...tickLabelStyles,
            y: '25',
            dx: -4,
            opacity: value % domain.labelStep === 0 ? 1 : 0
          })}
        />
        {includeArrows && (
          <Arrow direction="left" x={domain.min} y={0} className={classes.arrow} scale={scale} />
        )}
        {includeArrows && (
          <Arrow direction="right" x={domain.max} y={0} className={classes.arrow} scale={scale} />
        )}
        {domain.axisLabel && (
          <foreignObject
            x={size.width + 10}
            y={scale.y(0)}
            height={30}
            width={(domain.axisLabel ? domain.axisLabel.length : 1) * 10}
          >
            <div dangerouslySetInnerHTML={{ __html: domain.axisLabel }} />
          </foreignObject>
        )}
      </React.Fragment>
    );
  }
}

const XAxis = withStyles(axisStyles)(RawXAxis);

export class RawYAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    graphProps: types.GraphPropsType.isRequired
  };
  static defaultProps = AxisDefaultProps;
  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return (
      !utils.isDomainRangeEqual(this.props.graphProps, nextProps.graphProps) ||
      !isEqual(data, nextProps.data)
    );
  }
  render() {
    const { classes, includeArrows, graphProps } = this.props;
    const { scale, range, size } = graphProps;

    return (
      <React.Fragment>
        <Axis
          axisLineClassName={classes.line}
          orientation={'left'}
          scale={scale.y}
          top={0}
          height={size.height}
          left={scale.x(0)}
          numTicks={tickCount(range.min, range.max, range.step)}
          label={range.label}
          tickLength={10}
          tickClassName={classes.tick}
          tickLabelProps={value => {
            const digits = value.toLocaleString().length || 1;
            const show = value % range.labelStep === 0;

            return {
              ...tickLabelStyles,
              dy: 4,
              dx: -10 - digits * 5,
              opacity: show ? 1 : 0
            };
          }}
          hideZero={true}
          tickTextAnchor={'bottom'}
        />
        {includeArrows && (
          <Arrow direction="down" x={0} y={range.min} className={classes.arrow} scale={scale} />
        )}
        {includeArrows && (
          <Arrow direction="up" x={0} y={range.max} className={classes.arrow} scale={scale} />
        )}
        {range.axisLabel && (
          <foreignObject
            x={scale.x(0)}
            y={-30}
            height={30}
            width={(range.axisLabel ? range.axisLabel.length : 1) * 10}
          >
            <div dangerouslySetInnerHTML={{ __html: range.axisLabel }} />
          </foreignObject>
        )}
      </React.Fragment>
    );
  }
}
const YAxis = withStyles(axisStyles)(RawYAxis);

export default class Axes extends React.Component {
  static propTypes = AxisPropTypes;
  static defaultProps = AxisDefaultProps;
  render() {
    return (
      <React.Fragment>
        <XAxis {...this.props} />
        <YAxis {...this.props} />
      </React.Fragment>
    );
  }
}
