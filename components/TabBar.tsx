import { View, StyleSheet, Animated } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const { bottom } = useSafeAreaInsets();
  const animations = useRef(state.routes.map(() => new Animated.Value(1))).current;

  const animateTab = (index: number) => {
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={[styles.tabBar, { bottom: bottom + 20 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === 'string' 
          ? options.tabBarLabel 
          : typeof options.title === 'string'
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            animateTab(index);
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get the tab icon if it exists in the options
        const icon = options.tabBarIcon ? 
          options.tabBarIcon({ 
            focused: isFocused,
            color: isFocused ? colors.primary : colors.text,
            size: 24
          }) : 
          <Feather 
            name="home" 
            size={24} 
            color={isFocused ? colors.primary : colors.text}
          />;

        return (
          <Animated.View 
            key={route.key}
            style={[
              styles.tab,
              isFocused && styles.tabFocused,
              {
                transform: [{
                  scale: animations[index]
                }]
              }
            ]}
          >
            <PlatformPressable
              href={buildHref(route.name)}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={`tab-${route.name}`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabContent}
            >
              {icon}
              <Text style={[
                styles.label,
                { color: isFocused ? colors.primary : colors.text }
              ]}>
                {label}
              </Text>
            </PlatformPressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 80,
        borderRadius: 100,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabFocused: {
        backgroundColor: 'rgba(10, 126, 164, 0.1)',
        borderRadius: 100,
        
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    }
})
