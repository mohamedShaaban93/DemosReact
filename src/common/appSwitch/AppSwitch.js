import React, { Component } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Switch from './Switch';

class AppSwitch extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {
    switchValue: this.props.switchValue,
  };

  onChange = val => {
    const { onChange } = this.props;
    this.setState({ switchValue: val });
    onChange && onChange(val);
  };

  render() {
    const {
      disabled,
      activeText,
      inActiveText,
      circleSize,
      barHeight,
      backgroundActive,
      backgroundInactive,
      circleActiveColor,
      circleInActiveColor,
      switchWidthMultiplier,
      fontSize,
      ...rest
    } = this.props;

    return (
      <Switch
        value={this.state.switchValue}
        onValueChange={val => {
          this.onChange(val);
        }}
        disabled={disabled || false}
        activeText={activeText || I18n.t('switch-off')}
        inActiveText={inActiveText || I18n.t('switch-on')}
        activeTextStyle={{
          fontFamily: Platform.OS === 'ios' ? 'JF Flat' : 'JF Flat regular',
          fontSize: fontSize || 10,
        }}
        inactiveTextStyle={{
          fontFamily: Platform.OS === 'ios' ? 'JF Flat' : 'JF Flat regular',
          fontSize: fontSize || 10,
        }}
        circleSize={circleSize || 20}
        barHeight={barHeight || 28}
        circleBorderWidth={0.1}
        backgroundActive={backgroundActive || '#76A13A'}
        backgroundInactive={backgroundInactive || '#E04F46'}
        circleActiveColor={circleActiveColor || '#fff'}
        circleInActiveColor={circleInActiveColor || '#fff'}
        changeValueImmediately
        innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
        outerCircleStyle={{}}
        renderActiveText={this.state.switchValue}
        renderInActiveText={!this.state.switchValue}
        switchLeftPx={15}
        switchRightPx={15}
        switchWidthMultiplier={switchWidthMultiplier || 3.5}
        switchBorderRadius={20}
        containerStyle={{ backgroundColor: 'black', width: 20 }}
      />
    );
  }
}

export default connect()(AppSwitch);
