import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppView, AppScrollView } from '.';

class SelectionOptionsGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: props.multi
        ? props.initialValue || []
        : props.initialValue || -1,
    };
  }


  onSelect = (value, text) => {
    if (this.props.multi) {
      const index = this.state.selectedValue.indexOf(value);

      let newValue;
        if (index === -1) {
          // add
          newValue = [...this.state.selectedValue, value];
        } else {
          // remove
          newValue = [
            ...this.state.selectedValue.slice(0, index),
            ...this.state.selectedValue.slice(index + 1),
          ];
        }

        this.setState(prevState => ({
          selectedValue: newValue,
        }));

        if (this.props.onSelect) {
          if (this.props.name) this.props.onSelect(this.props.name, newValue);
          else this.props.onSelect(newValue);
        }
    } else {
      if (value === this.state.selectedValue) return;

      this.setState({
        selectedValue: value,
      });

      if (this.props.onSelect) {
        if (this.props.name) this.props.onSelect(value, text);
        else this.props.onSelect(value, text);
      }
    }
  };

  render() {
    const {
      children,
      multi,
      horizontal,
      scrollable,
      wrabContent,
      paddingVertical,
      ...rest
    } = this.props;

    const nodes =
      children && children.map
        ? children.map((child, index) => {
            let selected;

            if (multi) {
              selected =
                this.state.selectedValue.indexOf(child.props.value) !== -1;
            } else {
              selected = child.props.value === this.state.selectedValue;
            }

            const target = children.find(
              item => item.props.value === this.state.selectedValue,
            );

            let label = '';
            if (target) {
              label = target.props.text;
            }
            return React.cloneElement(child, {
              key: String(index),
              onPress: this.onSelect,
              selected,
              label,
            });
          })
        : null;

    if (horizontal && scrollable) {
      return (
        <AppView row {...rest}>
          <AppScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nodes}
          </AppScrollView>
        </AppView>
      );
    }
    if (horizontal) {
      return <React.Fragment>{nodes}</React.Fragment>;
    }
    if (wrabContent) {
      return (
        <AppView row wrap>
          {nodes}
        </AppView>
      );
    }

    return (
      <AppScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={this.props.style}
        contentContainerStyle={this.props.contentContainerStyle}
        paddingVertical={paddingVertical || 5}
        {...rest}
      >
        {nodes}
      </AppScrollView>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(SelectionOptionsGroup);
