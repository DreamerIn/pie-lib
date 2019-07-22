import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Root, createGraphProps } from '@pie-lib/plot';
import ChartGrid from './grid';
import ChartAxes from './axes';
import chartTypes from './chart-types';
import debug from 'debug';

const log = debug('pie-lib:charts:chart');

export class Chart extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    chartType: PropTypes.string.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }),
    domain: PropTypes.shape({
      label: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number
    }),
    data: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.number })),
    range: PropTypes.shape({}),
    charts: PropTypes.array,
    title: PropTypes.string,
    onDataChange: PropTypes.func
  };

  static defaultProps = {};

  state = {
    charts: [chartTypes.Bar(), chartTypes.Histogram(), chartTypes.Line()]
  };

  getChartComponent = () => {
    // TODO charts from props?
    const { chartType } = this.props;
    const { charts } = this.state;
    const selectedChart = charts.find(chart => chart.type === chartType);

    log('chartType: ', chartType);
    return selectedChart.Component;
  };

  changeData = data => {
    const { onDataChange } = this.props;

    onDataChange(data);
  };

  render() {
    const { classes, className, size, domain, range, title, data, chartType } = this.props;
    const ChartComponent = this.getChartComponent();

    // TODO make sure both domain & range have step!!!
    const common = {
      graphProps: createGraphProps(
        {
          step: 1,
          ...domain
        },
        {
          step: 1,
          ...range
        },
        size,
        () => this.rootNode
      )
    };
    log('[render] common:', common);

    const maskSize = {
      x: -10,
      y: -10,
      width: size.width + 20,
      height: size.height + 20
    };

    return (
      <div className={classNames(classes.class, className)}>
        <Root title={title} classes={classes} rootRef={r => (this.rootNode = r)} {...common}>
          <ChartGrid data={data} type={chartType} {...common} />
          <ChartAxes data={data} type={chartType} {...common} />
          <mask id="myMask">
            <rect {...maskSize} fill="white" />
          </mask>
          <g id="marks" mask="url('#myMask')">
            <ChartComponent data={data} onChange={this.changeData} {...common} />
          </g>
        </Root>
      </div>
    );
  }
}

const styles = theme => ({
  graphBox: {
    transform: 'translate(70px, 35px)'
  }
});

export default withStyles(styles)(Chart);
