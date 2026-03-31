import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width;

export default function ImageSlider({ data }: { data: any[] }) {
  const renderSeparator = () => <View style={{ width: 10 }} />;
  console.log('DATA', data);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        snapToInterval={ITEM_WIDTH + 10}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bannerImageContainer}
            onPress={() => {
              Alert.alert(`Warning: Image ${item.id} was clicked!`);
            }}>
            {/*<Image source={item.imageUrl} style={styles.bannerImage} />*/}
            <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxHeight: 200 },
  listContent: {},
  bannerImageContainer: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
