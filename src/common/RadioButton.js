import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RectButton } from 'react-native-gesture-handler';

import { TouchableOpacity } from 'react-native';
import { marginStyles } from './Base';
import View from './View';
import Text from './Text';
import Icon from './Icon';
import { getTheme } from './Theme';
import { RADIO_BUTTON_DISPLAY_NAME } from '../utils/Constants';
// TODO: Add custom button (for different radio shapes)
// TODO: REFACTOR
class RadioButton extends Component {
  static propTypes = {
    // ...Base.propTypes,
    selected: PropTypes.bool,
    size: PropTypes.number,
    activeColor: PropTypes.string,
    normalColor: PropTypes.string,
    labelColor: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    index: PropTypes.number,
    label: PropTypes.string,
    labelSize: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    touchableOpacity: PropTypes.bool,
    labelBold: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    size: getTheme().radioButton.size,
    activeColor: getTheme().radioButton.activeColor,
    normalColor: getTheme().radioButton.normalColor,
    labelColor: getTheme().radioButton.labelColor,
    labelBold: false,
    onPress: () => {},
  };

  render() {
    const {
      selected,
      size,
      activeColor,
      normalColor,
      value,
      index,
      onPress,
      label,
      labelSize,
      labelColor,
      style,
      touchableOpacity,
      labelBold,
      stretch,
      ...rest
    } = this.props;

    const color = selected ? activeColor : normalColor;

    const Container = touchableOpacity ? TouchableOpacity : RectButton;
    return (
      <View row>
        <Container
          onPress={() => {
            onPress(value, index);
          }}
          style={[
            marginStyles(this.props),
            { alignSelf: stretch ? 'stretch' : null },
          ]}
        >
          <View row {...rest} style={style}>
            <View
              bc={selected ? color : '#ACB5BB'}
              bw={2}
              circle
              circleRadius={size}
              mr={5}
              center
            >
              {selected ? (
                <View
                  circle
                  circleRadius={size * 0.5}
                  backgroundColor={color}
                />
              ) : null}
            </View>

            {this.props.icon && (
              <Icon
                name={this.props.name}
                type={this.props.type}
                size={8}
                // marginTop={2}
                marginHorizontal={3}
              />
            )}
          </View>
        </Container>
        <Text
          bold={labelBold}
          size={labelSize || size}
          color={labelColor}
          marginHorizontal={touchableOpacity && 5}
        >
          {label}
        </Text>
      </View>
    );
  }
}
RadioButton.displayName = RADIO_BUTTON_DISPLAY_NAME;
export default connect()(RadioButton);
