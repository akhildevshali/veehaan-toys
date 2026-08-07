import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function CompleteProfilePage() {
    
    const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");

useEffect(() => {
  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      setEmail(user.email);
    }
  };

  loadUser();
}, []);

  return (
    <div className="bg-gray-100 px-6 py-6">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Complete Your Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Please complete your profile before continuing.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2">

  <div>
    <label className="block text-sm font-medium mb-2">
      First Name *
    </label>
   <input
  type="text"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  placeholder="Enter first name"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Last Name
    </label>
    <input
  type="text"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
  placeholder="Enter last name"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Email
    </label>
    <input
  type="email"
  value={email}
  readOnly
  className="w-full border rounded-xl px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Phone Number *
    </label>
    <input
  type="tel"
  placeholder="Enter 10 digit mobile number"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium mb-2">
      Address
    </label>
    <textarea
  rows={2}
  placeholder="Enter address"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 resize-none"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      City
    </label>
    <input
  type="text"
  placeholder="City"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      State
    </label>
    <input
  type="text"
  placeholder="State"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      Pincode
    </label>
    <input
  type="text"
  placeholder="Pincode"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
<div className="md:col-span-2 flex justify-end mt-6">
  <button
    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-xl transition"
  >
    Save Profile
  </button>
</div>
  </div>

</div>

      </div>

    </div>
  );
}