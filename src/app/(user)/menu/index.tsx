import ProductListItem from '../../../components/ProductListItem';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useProductList } from '../../../api/products';
import Colors from '../../../constants/Colors';
import fallbackProducts from '../../../../assets/data/products';
export default function MenuScreen() {
  const { data: products, error, isLoading, isRefetching, refetch } = useProductList();
  const listData = products && products.length > 0 ? products : fallbackProducts;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Cooking up today&apos;s specials...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={listData}
      renderItem={({ item }) => <ProductListItem product={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        <View style={styles.headerCard}>
          <Text style={styles.headerEyebrow}>Fresh & Fast</Text>
          <Text style={styles.headerTitle}>Find your next favorite meal</Text>
          <Text style={styles.headerSubtitle}>
            Tap a dish to customize size and add it to your cart.
          </Text>
          {!!error && (
            <Text style={styles.fallbackText}>
              Live menu is unavailable, showing local sample menu.
            </Text>
          )}
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={Colors.light.tint}
        />
      }
    />
  );
}
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
    gap: 10,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 15,
  },
  content: {
    padding: 16,
    gap: 16,
    backgroundColor: '#f5f7fb',
    paddingBottom: 28,
  },
  row: {
    gap: 14,
  },
  headerCard: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 20,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerEyebrow: {
    color: '#c7d2fe',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontSize: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#d1d5db',
    marginTop: 8,
    fontSize: 14,
  },
  fallbackText: {
    marginTop: 8,
    color: '#fca5a5',
    fontWeight: '600',
    fontSize: 12,
  },
});
