import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/skeleton';

export const OrderCardSkeleton = () => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Skeleton width={120} height={18} borderRadius={4} />
      <Skeleton width={80} height={24} borderRadius={12} />
    </View>

    <View style={{ gap: 8, marginTop: 4 }}>
      <Skeleton width="50%" height={14} borderRadius={4} />
      <Skeleton width="40%" height={14} borderRadius={4} />
    </View>

    <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
      <Skeleton width={90} height={20} borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.08)',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
