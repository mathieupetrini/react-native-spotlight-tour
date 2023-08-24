import React, { memo, useContext, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Rect } from "react-native-svg";

import { Motion, SpotlightTourContext } from "../../../SpotlightTour.context";

interface RectShapeProps {
  motion: Motion;
  useNativeDriver: boolean;
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const RectShape = memo<RectShapeProps>(({ motion, useNativeDriver }) => {
  const { spot } = useContext(SpotlightTourContext);

  const center = useRef(new Animated.ValueXY({ x: 0, y: 0 }, { useNativeDriver }));
  const opacity = useRef(new Animated.Value(0, { useNativeDriver }));
  const radius = useRef(new Animated.Value(0, { useNativeDriver }));

  useEffect(() => {
    const { height, width } = spot;
    const r = (Math.max(width, height) / 2);
    const cx = width;
    const cy = height;

    const transition = (): Animated.CompositeAnimation => {
      switch (motion) {
        case "bounce":
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.spring(center.current, {
              damping: 45,
              mass: 4,
              stiffness: 350,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.spring(radius.current, {
              damping: 35,
              mass: 4,
              stiffness: 350,
              toValue: r,
              useNativeDriver,
            }),
          ]);

        case "fade":
          return Animated.sequence([
            Animated.timing(opacity.current, {
              duration: 400,
              toValue: 0,
              useNativeDriver,
            }),
            Animated.parallel([
              Animated.timing(center.current, {
                duration: 0,
                toValue: { x: cx, y: cy },
                useNativeDriver,
              }),
              Animated.timing(radius.current, {
                duration: 0,
                toValue: r,
                useNativeDriver,
              }),
            ]),
            Animated.timing(opacity.current, {
              duration: 400,
              toValue: 1,
              useNativeDriver,
            }),
          ]);

        case "slide":
          opacity.current.setValue(1);

          return Animated.parallel([
            Animated.timing(center.current, {
              duration: 400,
              toValue: { x: cx, y: cy },
              useNativeDriver,
            }),
            Animated.timing(radius.current, {
              duration: 400,
              toValue: r,
              useNativeDriver,
            }),
          ]);
      }
    };

    transition().start();
  }, [motion, spot, useNativeDriver]);

  if ([spot.height, spot.width].every(value => value <= 0)) {
    return null;
  }

  return (
    <AnimatedRect
      height={spot.height}
      width={spot.width}
      x={spot.x}
      y={spot.y}
      opacity={opacity.current}
      fill="black"
    />
  );
}, (prev, next) => prev.motion === next.motion);
