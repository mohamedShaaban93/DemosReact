import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated } from 'react-native';
import View from './View';
import Text from './Text';
import Button from './Button';
import { getTheme } from './Theme';
import { getThemeColor } from './utils/colors';

class DefaultTabBar extends Component {
  static defaultProps = {
    ...getTheme().tabBar,
  };

  renderTab = (name, page, isActive, onPressHandler) => {
    const {
      activeTextColor,
      activeTextSize,
      activeTextBold,
      inactiveTextColor,
      inactiveTextSize,
      inactiveTextBold,
    } = this.props;

    const textColor = isActive ? activeTextColor : inactiveTextColor;
    const textSize = isActive ? activeTextSize : inactiveTextSize;
    const textBold = isActive ? activeTextBold : inactiveTextBold;

    return (
      <Button
        key={String(page)}
        backgroundColor="transparent"
        flex
        stretch
        borderRadius={0}
        ph={0}
        pv={0}
        color={textColor}
        size={textSize}
        bold={textBold}
        onPress={() => {
          onPressHandler(page);
        }}
        title={name}
      />
    );
  };

  render() {
    const {
      containerWidth,
      tabs,
      backgroundColor,
      height,
      activePage,
      goToPage,
      scrollValue,
      stickyScrollValue,
      rtl,
      underlineColor,
      underlineHeight,
      scrollAnimationRange,
    } = this.props;

    const numberOfTabs = tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: underlineHeight,
      backgroundColor: getThemeColor(underlineColor),
      bottom: 0,
    };

    const translateX = scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (containerWidth / numberOfTabs) * (rtl ? -1 : 1)],
    });

    this.tabsTransY = stickyScrollValue.interpolate({
      inputRange: [0, scrollAnimationRange, scrollAnimationRange + 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateY: this.tabsTransY }],
          zIndex: 1,
        }}
      >
        <View row backgroundColor={backgroundColor} height={height}>
          {tabs.map(tab => {
            const isTabActive = activePage === tab.page;

            return this.renderTab(tab.label, tab.page, isTabActive, goToPage);
          })}

          <Animated.View
            style={[
              tabUnderlineStyle,
              {
                transform: [{ translateX }],
              },
              this.props.underlineStyle,
            ]}
          />
        </View>
      </Animated.View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(DefaultTabBar);
