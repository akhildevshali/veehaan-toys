import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { supabase, Product, Review } from '../lib/supabase';
import ProductCardMobile from '../components/ProductCardMobile';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsRes, reviewsRes] = await Promise.all([
      supabase.from('products').select('*').eq('featured', true).limit(6),
      supabase.from('reviews').select('*').eq('featured', true),
    ]);

    if (productsRes.data) setFeaturedProducts(productsRes.data);
    if (reviewsRes.data) setReviews(reviewsRes.data);
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Where Every Toy</Text>
        <Text style={styles.heroSubtitle}>Sparks Joy! 🎈</Text>
        <Text style={styles.heroDescription}>
          Discover amazing toys for your little ones
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.ctaButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🚚</Text>
          <Text style={styles.featureTitle}>Free Shipping</Text>
          <Text style={styles.featureDesc}>Above ₹999</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureTitle}>100% Safe</Text>
          <Text style={styles.featureDesc}>Quality tested</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>☎️</Text>
          <Text style={styles.featureTitle}>24/7 Support</Text>
          <Text style={styles.featureDesc}>Always here</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Featured Toys</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ef4444" style={{ marginVertical: 20 }} />
        ) : (
          <View>
            {featuredProducts.map((product) => (
              <ProductCardMobile
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate('ProductDetailFromHome', { product })
                }
              />
            ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.viewAllButtonText}>View All Toys →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>💖 Happy Customers</Text>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewStars}>
              {[...Array(review.rating)].map((_, i) => (
                <Text key={i} style={styles.star}>
                  ⭐
                </Text>
              ))}
            </View>
            <Text style={styles.reviewText}>"{review.review_text}"</Text>
            <Text style={styles.reviewAuthor}>- {review.customer_name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaSectionTitle}>Ready to Shop?</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.ctaButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  hero: {
    backgroundColor: '#ef4444',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fef08a',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  viewAllButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fcd34d',
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: {
    padding: 16,
    backgroundColor: '#fef3c7',
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  reviewAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  ctaSection: {
    backgroundColor: '#ef4444',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
});
