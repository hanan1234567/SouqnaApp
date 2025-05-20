/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, Dimensions, ScrollView} from 'react-native';
import {BASE_URL_Product} from '../../../api/apiServices';

const {width, height} = Dimensions.get('window');

const ProductImages = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{width: width, height: height * 0.35}}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{uri: `${BASE_URL_Product}${img.path}`}}
            style={{
              width: width,
              height: height * 0.35,
              resizeMode: 'contain',
              backgroundColor: '#fff',
            }}
          />
        ))}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white
            // backdropFilter: 'blur(8px)', // Not supported on RN yet; use BlurView if needed
          }}>
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === activeIndex ? '#000' : '#888',
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProductImages;
