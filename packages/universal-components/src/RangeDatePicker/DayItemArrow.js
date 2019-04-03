// @flow

import * as React from 'react';
import { Animated, Easing, View, Platform } from 'react-native';

import { type StylePropType, StyleSheet } from '../PlatformStyleSheet';
import { designTokens } from '../DesignTokens';

type Props = {|
  +style?: StylePropType,
|};

const SHARED_ANIMATION_CONFIG = {
  duration: designTokens.durationArrowScaleAnimation,
  useNativeDriver: true,
  easing: Easing.ease,
};

const isAnimationEnabled = Platform.OS !== 'android';

export default class DayItemArrow extends React.Component<Props> {
  componentDidMount() {
    this.animating = true;
    if (isAnimationEnabled) {
      this.handleAnimation();
    }
  }

  componentWillUnmount() {
    this.animating = false;
  }

  animating: boolean;
  scale: Animated.Value = new Animated.Value(0);

  handleAnimation() {
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(this.scale, {
        ...SHARED_ANIMATION_CONFIG,
        toValue: 1,
      }),
      Animated.timing(this.scale, {
        ...SHARED_ANIMATION_CONFIG,
        toValue: 0,
      }),
    ]).start(() => {
      if (this.animating) {
        this.handleAnimation();
      }
    });
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {isAnimationEnabled && (
          <Animated.View
            style={[
              styles.easingArrow,
              {
                transform: [{ scale: this.scale }],
              },
            ]}
          />
        )}
        <View style={styles.innerArrow} />
      </View>
    );
  }
}

const innerArrowSize = 8;
const easingArrowSize = 20;
const innerArrowMargin = (easingArrowSize - innerArrowSize) / 2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
  },
  easingArrow: {
    backgroundColor: designTokens.backgroundDayItemEasingArrow,
    width: easingArrowSize,
    height: easingArrowSize,
    position: 'absolute',
  },
  innerArrow: {
    backgroundColor: designTokens.borderColorCalendarItem,
    width: innerArrowSize,
    height: innerArrowSize,
    position: 'absolute',
    marginStart: innerArrowMargin,
    marginTop: innerArrowMargin,
  },
});