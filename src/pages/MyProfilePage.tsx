import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";


export default function MyProfilePage() {

const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [gender, setGender] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

useEffect(() => {
  loadProfile();
}, []);

async function handleSave() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      gender: gender,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

if (error) {
  console.error("Supabase Error:", error);
  alert(error.message);
} else {
  alert("Profile updated successfully.");
}
}

async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  setEmail(user.email || "");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return;

  setFirstName(data.first_name || "");
  setLastName(data.last_name || "");
  setGender(data.gender || "");
  setPhone(data.phone || "");
}


  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium mb-2">
              First Name
            </label>
<input
  type="text"
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  className="..."
/>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              readOnly
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">
    Phone Number
  </label>

  <input
    type="tel"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full border rounded-lg px-4 py-3"
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium mb-2">
    Gender
  </label>

  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="Male"
        checked={gender === "Male"}
        onChange={(e) => setGender(e.target.value)}
      />
      Male
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="Female"
        checked={gender === "Female"}
        onChange={(e) => setGender(e.target.value)}
      />
      Female
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="Prefer not to say"
        checked={gender === "Prefer not to say"}
        onChange={(e) => setGender(e.target.value)}
      />
      Prefer not to say
    </label>
  </div>
</div>

<div className="mt-8 flex justify-end">
<button
  type="button"
  onClick={handleSave}
  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 shadow-sm"
>
    Save Changes
  </button>
</div>

        </div>
      </div>
    </div>
  );
}