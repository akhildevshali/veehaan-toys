import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';

interface ContactScreenProps {
  navigation: any;
}

export default function ContactScreen({ navigation }: ContactScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      Alert.alert('Success', 'Your message has been sent!');
    }, 1000);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '+919876543210';
    const message = 'Hi VeehaanToys! I have a question about your products.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:hello@veehantoys.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+919876543210');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>📞</Text>
        <Text style={styles.heroTitle}>Contact Us</Text>
      </View>

      <View style={styles.contactMethods}>
        <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactTitle}>Email</Text>
          <Text style={styles.contactValue}>hello@veehantoys.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={handlePhone}>
          <Text style={styles.contactIcon}>📱</Text>
          <Text style={styles.contactTitle}>Phone</Text>
          <Text style={styles.contactValue}>+91 99004 85693</Text>
        </TouchableOpacity>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactTitle}>Location</Text>
          <Text style={styles.contactValue}>Bengaluru, India</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
        <Text style={styles.whatsappIcon}>💬</Text>
        <View style={styles.whatsappContent}>
          <Text style={styles.whatsappTitle}>Chat on WhatsApp</Text>
          <Text style={styles.whatsappDesc}>Quick response!</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.formSection}>
        <Text style={styles.formTitle}>Send Us a Message</Text>

        {submitted ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>Message sent!</Text>
            <Text style={styles.successDesc}>
              We'll get back to you soon.
            </Text>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Your Name *"
              value={formData.name}
              onChangeText={(text) =>
                setFormData({ ...formData, name: text })
              }
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData({ ...formData, phone: text })
              }
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Your Message *"
              value={formData.message}
              onChangeText={(text) =>
                setFormData({ ...formData, message: text })
              }
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.hoursSection}>
        <Text style={styles.hoursTitle}>📋 Support Hours</Text>
        <View style={styles.hoursBox}>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Monday - Friday</Text>
            <Text style={styles.timeLabel}>9 AM - 7 PM</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Saturday</Text>
            <Text style={styles.timeLabel}>10 AM - 5 PM</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayLabel}>Sunday</Text>
            <Text style={styles.timeLabel}>Closed</Text>
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
  contactMethods: {
    padding: 12,
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    color: '#666',
  },
  whatsappBtn: {
    backgroundColor: '#25d366',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  whatsappContent: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  whatsappDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  formSection: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 12,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#ecfdf5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  successDesc: {
    fontSize: 13,
    color: '#047857',
  },
  hoursSection: {
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  hoursBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeLabel: {
    fontSize: 13,
    color: '#666',
  },
});
