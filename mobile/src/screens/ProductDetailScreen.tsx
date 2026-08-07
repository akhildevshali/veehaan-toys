import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Product } from '../lib/supabase';
import { formatPrice } from '../lib/cart';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/cart';

interface ProductDetailScreenProps {
  route: any;
  navigation: any;
}

export default function ProductDetailScreen({
  route,
  navigation,
}: ProductDetailScreenProps) {
  const product: Product = route.params?.product;

  const handleAddToCart = async () => {
    try {
      const sessionId = await getSessionId();

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('session_id', sessionId)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id);
      } else {
        await supabase.from('cart_items').insert({
          session_id: sessionId,
          product_id: product.id,
          quantity: 1,
        });
      }

      Alert.alert('Success', 'Added to cart! 🎉', [
        {
          text: 'Continue Shopping',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Go to Cart',
          onPress: () => navigation.navigate('MyCart'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
        {product.featured && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ Featured</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.star}>
              ⭐
            </Text>
          ))}
          <Text style={styles.ratingText}>(4.8 out of 5)</Text>
        </View>

        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        <View style={styles.stockContainer}>
          {product.in_stock ? (
            <View style={styles.inStock}>
              <Text style={styles.stockText}>
                ✓ In Stock ({product.stock_quantity} available)
              </Text>
            </View>
          ) : (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✓ Premium quality materials</Text>
            <Text style={styles.featureItem}>✓ Child-safe design</Text>
            <Text style={styles.featureItem}>✓ Easy to clean and maintain</Text>
            <Text style={styles.featureItem}>✓ Encourages imaginative play</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            !product.in_stock && styles.addButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={!product.in_stock}
        >
          <Text style={styles.addButtonText}>
            {product.in_stock ? '🛒 Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🚚</Text>
            <Text style={styles.infoTitle}>Free Delivery</Text>
            <Text style={styles.infoDesc}>Above ₹999</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🛡️</Text>
            <Text style={styles.infoTitle}>Safe & Tested</Text>
            <Text style={styles.infoDesc}>Quality assured</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    backgroundColor: '#f3f4f6',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fcd34d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  star: {
    fontSize: 18,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  stockContainer: {
    marginBottom: 20,
  },
  inStock: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  outOfStock: {
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  outOfStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
