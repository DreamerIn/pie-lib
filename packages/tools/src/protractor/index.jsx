import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Graphic from './graphic';
import Anchor from '../anchor';
import Rotatable from '../rotatable';
import classNames from 'classnames';

export class Protractor extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    width: 450
  };

  render() {
    const { classes, width } = this.props;
    return (
      <Rotatable
        handle={[
          {
            class: 'leftAnchor',
            origin: `${width * 0.495}px ${width * 0.49}px`
          },
          {
            class: 'rightAnchor',
            origin: `${width * 0.495}px ${width * 0.49}px`
          }
        ]}
      >
        <div className={classes.protractor} style={{ width: `${width}px` }}>
          <Graphic />

          <Anchor className={classNames('leftAnchor', classes.leftAnchor)} />
          <Anchor className={classNames('rightAnchor', classes.rightAnchor)} />
        </div>
      </Rotatable>
    );
  }
}

export default withStyles(() => ({
  protractor: { position: 'relative' },
  leftAnchor: {
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  rightAnchor: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
}))(Protractor);
