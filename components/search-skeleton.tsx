import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export const SearchSkeleton = () => {
  return (
    <View style={styles.searchResultItem}>
      <Skeleton width={50} height={50} borderRadius={8} />
      <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
        <Skeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="30%" height={12} borderRadius={4} />
      </View>

      <View style={{ paddingRight: 4 }}>
        <Skeleton width={16} height={16} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
    minHeight: 75,
  },
});
