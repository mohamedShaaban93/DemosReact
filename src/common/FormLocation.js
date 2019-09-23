import React from 'react';
import PropTypes from 'prop-types';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import Network from './Base/Network';
import View from './View';
import Text from './Text';
import AppNavigation from './Navigation';
import InputError from './micro/InputError';
import { getTheme } from './Theme';
import { getPlaceName } from '../utils';
import { AppText, AppView } from '.';
import { responsiveHeight } from './utils/responsiveDimensions';

class Picker extends Network {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    error: PropTypes.string,
    noValidation: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '',
    leftItems: [],
    rightItems: [],
    ...getTheme().formInputFrame,
  };

  constructor(props) {
    super(props);

    this.state = {
      label: props.placeholder,
      alias: props.alias,
      value: null,
    };

    if ((props.onChange, props.initialValue)) {
      if (props.name) props.onChange(props.name, props.initialValue, true);
      else props.onChange(props.initialValue);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset !== this.props.reset) {
      this.clear();
    }
  }

  onChange = async (value, noValidate) => {
    const { name, onChange } = this.props;

    let locationName = '';
    if (value) {
      locationName = await getPlaceName(value.latitude, value.longitude);
    }

    this.setState({
      alias: locationName,
      value,
    });
    if (onChange) {
      if (name) onChange(name, value, noValidate);
      else onChange(value);
    }
  };

  clear = () => {
    this.onChange(this.props.placeholder || '', true);
  };

  renderItems = items => {
    const { size, color } = this.props;

    const nodes = items.map(item => {
      if (
        item.type.WrappedComponent &&
        (item.type.WrappedComponent.displayName === 'Button' ||
          item.type.WrappedComponent.displayName === 'Icon')
      ) {
        return React.cloneElement(item, {
          key: String(Math.random()),
          transparent: true,
          stretch: item.type.WrappedComponent.displayName === 'Button',
          color: item.props.color || color,
          size: item.props.size || size * 1.5,
          backgroundColor: 'transparent',
          ph: item.props.ph || size / 1.5,
          pv: 0,
        });
      }
      return React.cloneElement(item, {
        key: String(Math.random()),
      });
    });

    return nodes;
  };

  render() {
    const {
      rtl,
      size,
      color,
      placeholderColor,
      backgroundColor,
      width,
      height,
      borderRadius,
      center,
      farArrow,
      error,
      flex,
      elevation,
      onChange,
      name,
      children,
      noValidation,
      m,
      mh,
      mv,
      mt,
      mb,
      ml,
      mr,
      bw,
      btw,
      bbw,
      blw,
      brw,
      bc,
      btc,
      bbc,
      blc,
      brc,
      title,
      searchTitle,
      data,
      iconType,
      iconName,
      marginBottom,
    } = this.props;

    let { leftItems, rightItems } = this.props;

    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

    return (
      <View
        stretch
        flex={flex}
        m={m}
        mh={mh}
        mv={mv}
        mt={mt}
        mb={mb}
        ml={ml}
        mr={mr}
        width={width}
        marginBottom={marginBottom}
        height={height}
      >
        <View
          stretch
          row
          height={height}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          elevation={elevation}
          bw={bw}
          btw={btw}
          bbw={bbw}
          blw={blw}
          brw={brw}
          bc={bc}
          btc={btc}
          bbc={bbc}
          blc={blc}
          brc={brc}
          style={{ overflow: 'visible' }}
        >
          {this.state.alias && (
            <AppView
              marginHorizontal={11}
              paddingHorizontal={3}
              borderRadius={10}
              style={{
                position: 'absolute',
                top: -responsiveHeight(1.5) / 2,
              }}
              height={3.5}
              center
              // backgroundColor="red"
              marginTop={1}
              transparent
            >
              <AppText color="#8A8A8A" size={0.8 * size}>
                {this.props.placeholder}
              </AppText>
            </AppView>
          )}
          <RectButton
            onPress={() => {
              AppNavigation.push({
                name: 'mapScreen',
                passProps: {
                  onLocationChangeCallback: loc => {
                    this.onChange(loc);
                  },
                },
              });
            }}
            style={[
              {
                flexDirection: rtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: center ? 'center' : 'flex-start',
                flex: 1,
                alignSelf: 'stretch',
                padding: 0,
              },
            ]}
          >
            {leftItems.length ? (
              <AppView margin={1} padding={1} backgroundColor="transparent">
                {leftItems.length &&
                  !this.state.loading &&
                  this.renderItems(leftItems)}
              </AppView>
            ) : null}
            <View flex>
              <Text
                color={placeholderColor}
                size={size}
                // mh={3}
                numberOfLines={1}
                marginTop={this.state.alias ? 2 : undefined}
                marginHorizontal={1}
              >
                {this.state.alias || this.state.label}
              </Text>
            </View>
          </RectButton>
          {rightItems.length ? this.renderItems(rightItems) : null}
        </View>

        {!noValidation ? <InputError error={error} size={size} /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(Picker);
