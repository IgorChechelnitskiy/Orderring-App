import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export const CategoryDishSkeleton = () => (
  <View style={styles.dishCardSkeleton}>
    <Skeleton width={100} height={100} borderRadius={12} />

    <View style={styles.dishInfo}>
      <Skeleton width="80%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
      <Skeleton width="60%" height={12} borderRadius={4} style={{ marginBottom: 12 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Skeleton width="30%" height={16} borderRadius={4} />
        <Skeleton width="20%" height={16} borderRadius={4} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  dishCardSkeleton: {
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(128,128,128,0.05)',
  },
  dishInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
});
