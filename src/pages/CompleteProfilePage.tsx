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

const handleSave = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not found");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
    });

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Profile Saved Successfully");

  window.location.href = "/";
};


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
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
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
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  placeholder="Enter address"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">
      City
    </label>
    <input
  type="text"
  value={city}
onChange={(e) => setCity(e.target.value)}
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
  value={state}
onChange={(e) => setState(e.target.value)}
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
  value={pincode}
onChange={(e) => setPincode(e.target.value)}
  placeholder="Pincode"
  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
/>
<div className="md:col-span-2 flex justify-end mt-6">
  <button
  onClick={handleSave}
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