import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RectButton } from 'react-native-gesture-handler';

// import { copyMethodsToClass } from './utils/helpers';
// import Base from './Base';
import View from './View';
import Text from './Text';
import Icon from './Icon';
// import Theme from '../theme/Theme';

import { getTheme } from './Theme';

import { BasePropTypes, marginStyles } from './Base';

import { responsiveWidth } from './utils/responsiveDimensions';
import { CHECK_BOX_DISPLAY_NAME } from '../utils/Constants';

class CheckBox extends Component {
  static propTypes = {
    // ...Base.propTypes,
    // ...BasePropTypes,
    checked: PropTypes.bool,
    size: PropTypes.number,
    activeColor: PropTypes.string,
    normalColor: PropTypes.string,
    labelColor: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
    index: PropTypes.number,
    label: PropTypes.string,
    labelSize: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    customActiveRenderer: PropTypes.func,
    labelBold: PropTypes.bool,
  };

  static defaultProps = {
    checked: false,
    ...getTheme().checkBox,
    onPress: () => {},
    labelBold: false,
  };

  render() {
    const {
      size,
      labelSize,
      labelColor,
      label,
      onPress,
      style,
      checked,
      activeColor,
      normalColor,
      value,
      index,
      labelBold,
      customActiveRenderer,
      ...rest
    } = this.props;

    const color = checked ? activeColor : normalColor;

    return (
      <View row style={style}>
        <RectButton
          onPress={() => {
            onPress(value, index);
          }}
          style={[
            marginStyles(rest),
            { alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <View
            bc={'grey'}
            bw={1.5}
            mr={5}
            center
            borderRadius={4}
            style={[
              {
                width: responsiveWidth(size * 0.9),
                height: responsiveWidth(size * 0.9),
              },
            ]}
          >
            {checked ? (
              customActiveRenderer ? (
                customActiveRenderer(size, color)
              ) : (
                <Icon
                  name="check"
                  type="entypo"
                  size={size * 1.2}
                  color="primary"
                />
              )
            ) : null}
          </View>
        </RectButton>
        <Text bold={labelBold} size={labelSize || size} color={labelColor}>
          {label}
        </Text>
      </View>
    );
  }
}

CheckBox.displayName = CHECK_BOX_DISPLAY_NAME;
export default connect()(CheckBox);
