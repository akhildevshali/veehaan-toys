import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AboutScreenProps {
  navigation: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>❤️</Text>
        <Text style={styles.heroTitle}>About VeehaanToys</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.text}>
          VeehaanToys was born from a simple belief: every child deserves toys that
          spark imagination, encourage learning, and bring endless joy.
        </Text>
        <Text style={styles.text}>
          Our founders, passionate parents themselves, understood the challenge of
          finding toys that are both fun and educational. They set out to create a
          curated collection of toys that meet the highest safety standards.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🎁</Text>
          <Text style={styles.featureTitle}>Carefully Curated</Text>
          <Text style={styles.featureDesc}>
            Every toy is handpicked for quality and safety
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureTitle}>Safety Certified</Text>
          <Text style={styles.featureDesc}>
            All products tested with non-toxic materials
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🚚</Text>
          <Text style={styles.featureTitle}>Fast Delivery</Text>
          <Text style={styles.featureDesc}>
            Free shipping above ₹999 across India
          </Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📚</Text>
          <Text style={styles.featureTitle}>Educational</Text>
          <Text style={styles.featureDesc}>
            Toys that promote learning and creativity
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Promise</Text>
        <View style={styles.promiseItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.promiseText}>100% safe toys for children</Text>
        </View>
        <View style={styles.promiseItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.promiseText}>Quality guaranteed</Text>
        </View>
        <View style={styles.promiseItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.promiseText}>Affordable pricing</Text>
        </View>
        <View style={styles.promiseItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.promiseText}>24/7 customer support</Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>10,000+</Text>
          <Text style={styles.statLabel}>Happy Customers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Quality Toys</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.8/5</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Shop?</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
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
    padding: 32,
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  featureCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  promiseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 20,
    color: '#059669',
    marginRight: 12,
    fontWeight: 'bold',
  },
  promiseText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    margin: 8,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d97706',
  },
  statLabel: {
    fontSize: 12,
    color: '#78350f',
    marginTop: 4,
  },
  ctaSection: {
    backgroundColor: '#ef4444',
    margin: 8,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  shopBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
