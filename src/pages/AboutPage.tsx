import { Heart, Sparkles, Award, ShieldCheck } from 'lucide-react'

export function AboutPage() {
  const values = [
    { icon: Heart, title: 'Made with Love', desc: 'Every toy is selected with care to bring joy to children everywhere.' },
    { icon: ShieldCheck, title: 'Safety First', desc: 'All our products meet strict safety standards for peace of mind.' },
    { icon: Sparkles, title: 'Quality You Can Trust', desc: 'We source only from reputable brands known for their quality.' },
    { icon: Award, title: 'Award Winning', desc: 'Recognized for excellence in children\'s toys and customer service.' },
  ]

  return (
    <div>
      <section className="bg-gradient-to-r from-red-500 to-yellow-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About VeehaanToys</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">We believe every child deserves to play, learn, and grow with toys that spark imagination.</p>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Story</h2>
        <div className="text-gray-600 leading-relaxed space-y-4">
          <p>VeehaanToys started with a simple idea — to bring quality, affordable, and safe toys to children everywhere. What began as a small family business has grown into a trusted online destination for parents looking for the perfect gift.</p>
          <p>We carefully curate our collection to include toys that are not only fun but also educational. From soft toys for toddlers to remote control cars for adventurous kids, we have something for every child.</p>
          <p>Our commitment to quality and customer satisfaction has made us a favorite among parents across the country. We invite you to explore our collection and find the perfect toy for your little one.</p>
        </div>
      </section>
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <val.icon className="text-orange-500" size={26} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[{ value: '10K+', label: 'Happy Customers' }, { value: '500+', label: 'Products' }, { value: '50+', label: 'Brands' }, { value: '4.8★', label: 'Average Rating' }].map((stat, i) => (
            <div key={i} className="p-6">
              <p className="text-3xl font-bold text-red-500">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
