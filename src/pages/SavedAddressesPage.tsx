import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type SavedAddress = {
  id: string;
  fullName: string;
  mobile: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  alternatePhone: string;
  addressType: string;
};

const emptyForm = {
  fullName: "",
  mobile: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  addressType: "Home",
};

export default function SavedAddressesPage() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] =  useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [addressType, setAddressType] = useState("Home");

  const resetForm = () => {
    setFullName(emptyForm.fullName);
    setMobile(emptyForm.mobile);
    setPincode(emptyForm.pincode);
    setLocality(emptyForm.locality);
    setAddress(emptyForm.address);
    setCity(emptyForm.city);
    setState(emptyForm.state);
    setLandmark(emptyForm.landmark);
    setAlternatePhone(emptyForm.alternatePhone);
    setAddressType(emptyForm.addressType);
    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddressForm(true);
  };

  const openEditForm = (addr: SavedAddress) => {
    setFullName(addr.fullName);
    setMobile(addr.mobile);
    setPincode(addr.pincode);
    setLocality(addr.locality);
    setAddress(addr.address);
    setCity(addr.city);
    setState(addr.state);
    setLandmark(addr.landmark);
    setAlternatePhone(addr.alternatePhone);
    setAddressType(addr.addressType);
    setEditingId(addr.id);
    setShowAddressForm(true);
  };

  const closeForm = () => {
    setShowAddressForm(false);
    resetForm();
  };

const loadAddresses = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const formatted =
    data?.map((item) => ({
      id: item.id,
      fullName: item.full_name,
      mobile: item.phone,
      pincode: item.pincode,
      locality: item.address_line2,
      address: item.address_line1,
      city: item.city,
      state: item.state,
      landmark: item.landmark || "",
      alternatePhone: item.alternate_phone || "",
      addressType: item.address_type,
    })) || [];

  setSavedAddresses(formatted);
};

useEffect(() => {
  loadAddresses();
}, []);

  const isFormValid =
    fullName.trim() &&
    mobile.trim().length === 10 &&
    pincode.trim().length === 6 &&
    locality.trim() &&
    address.trim() &&
    city.trim() &&
    state.trim();

  const handleSave = async () => {
    const {  data: { user },} = await supabase.auth.getUser();

if (!user) {
  alert("Please login first.");
  return;
}
    if (!isFormValid) return;



    if (editingId !== null) {

const { error } = await supabase
  .from("addresses")
  .update({
    full_name: fullName,
    phone: mobile,
    address_line1: address,
    address_line2: locality,
    city,
    state,
    pincode,
    address_type: addressType,
    landmark,
    alternate_phone: alternatePhone,
  })
  .eq("id", editingId);

if (error) {
  console.error(error);
  alert("Failed to update address.");
  return;
}

      setSavedAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                fullName,
                mobile,
                pincode,
                locality,
                address,
                city,
                state,
                landmark,
                alternatePhone,
                addressType,
              }
            : a
        )
      );
    } else {

const { error } = await supabase.from("addresses").insert({
  user_id: user.id,
  full_name: fullName,
  phone: mobile,
  address_line1: address,
  address_line2: locality,
  city,
  state,
  pincode,
  address_type: addressType,
  landmark,
  alternate_phone: alternatePhone,
});

if (error) {
  console.error(error);
  alert("Failed to save address.");
  return;
}

      const newAddress: SavedAddress = {
        id: crypto.randomUUID(),
        fullName,
        mobile,
        pincode,
        locality,
        address,
        city,
        state,
        landmark,
        alternatePhone,
        addressType,
      };
      setSavedAddresses((prev) => [...prev, newAddress]);
    }

    closeForm();
  };

 const handleDelete = async (id: string) => {
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Failed to delete address.");
    return;
  }

  setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
  setDeleteConfirmId(null);
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Saved Addresses
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your delivery addresses
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          + Add New Address
        </button>

      </div>

      {/* Address List */}
      <div className="space-y-5">

        {showAddressForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-5 max-h-[85vh] overflow-y-auto">

              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">
                  {editingId !== null ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
                </h2>

                <button
                  onClick={closeForm}
                  className="text-2xl text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setMobile(value);
                    }
                  }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setPincode(value);
                    }
                  }}
                  placeholder="Pincode"
                  maxLength={6}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Locality"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address (Area and Street)"
                  rows={2}
                  className="md:col-span-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 resize-none focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City/District/Town"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">--Select State--</option>

                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>

                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">
                      Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>

                  </select>
                </div>

                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Landmark (Optional)"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setAlternatePhone(value);
                    }
                  }}
                  placeholder="Alternate Phone (Optional)"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />

              </div>

              {/* Address Type */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Address Type</p>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={addressType === "Home"}
                      onChange={() => setAddressType("Home")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-800">Home</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={addressType === "Work"}
                      onChange={() => setAddressType("Work")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-800">Work</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-4">
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-lg transition"
                >
                  SAVE
                </button>

                <button
                  onClick={closeForm}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  CANCEL
                </button>
              </div>

            </div>
          </div>
        )}

        {savedAddresses.length === 0 ? (
          <div className="border rounded-xl p-10 text-center bg-white">
            <h3 className="text-lg font-semibold">
              No Saved Addresses
            </h3>

            <p className="text-gray-500 mt-2">
              Click "Add New Address" to save your first delivery address.
            </p>
          </div>
        ) : (
          savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="border rounded-xl p-5 bg-white flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{addr.fullName}</span>
                  <span className="text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-600">
                    {addr.addressType}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-gray-500 text-sm">Landmark: {addr.landmark}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Mobile: {addr.mobile}</p>
              </div>

              <div className="flex gap-3 flex-shrink-0 ml-4">
                <button
                  onClick={() => openEditForm(addr)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(addr.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

      </div>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Delete this address?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
