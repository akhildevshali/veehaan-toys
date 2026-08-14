import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { supabase, type Product, type Category, type ChatMessage, type Banner, slugify } from '../lib/supabase'
import { formatPrice, formatPriceUsd } from '../lib/cart'
import { uploadMedia, deleteMedia, isImageFile, isVideoFile } from '../lib/media'
import { Plus, Pencil, Trash2, X, Package, FolderTree, Grid2x2, Star, Check, CircleAlert as AlertCircle, Search, Upload, Download, ChevronDown, Image as ImageIcon, Video, Loader as Loader2, MessageCircle, Tag, SquareCheck as CheckSquare, Square, GalleryVerticalEnd as GalleryVertical, ArrowUp, ArrowDown, Eye, EyeOff, Subtitles } from 'lucide-react'
import JSZip from "jszip";

interface ProductFormData {
  sku: string
  name: string
  slug: string
  description: string
  specifications: string[]
  price: string
  price_usd: string
  mrp: string
  image_url: string
  additional_images: string[]
  video_url: string
  category_id: string
  stock_quantity: string
  in_stock: boolean
  featured: boolean
}

const emptyProduct: ProductFormData = {
  sku: '', name: '', slug: '', description: '', specifications: ['', '', '', '', '', ''],
  price: '', price_usd: '', mrp: "", image_url: '', additional_images: [], video_url: '',
  category_id: '', stock_quantity: '', in_stock: true, featured: false,
}

const MAX_IMAGES = 6
const NUM_SPECS = 6

interface BannerFormData {
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image_url: string
  background_color: string
  display_order: string
  is_active: boolean
}
interface ShopCategory {
  id: string
  title: string
  subtitle: string | null
  image_url: string | null
  button_text: string | null
  button_link: string | null
  display_order: number
  is_active: boolean
}
const emptyBanner: BannerFormData = {
  title: '', subtitle: '', button_text: '', button_link: '',
  image_url: '', background_color: 'linear-gradient(to right, #ef4444, #f59e0b)',
  display_order: '0', is_active: true,
}
const emptyShopCategory = {
  title: '',
  subtitle: '',
  image_url: '',
  button_text: '',
  button_link: '',
  display_order: '0',
  is_active: true,
}
export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<
    'products' |
    'categories' |
    'banners' |
    'promo_banners' |
    'shop_categories' |
    'inquiries'
  >('products')

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [uploading, setUploading] = useState(false)
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [showZipUploadModal, setShowZipUploadModal] = useState(false);
  const [zipUpload, setZipUpload] = useState({
  fileName: "",
  total: 0,
  uploaded: 0,
  failed: 0,
  currentFile: "",
  progress: 0,
  completed: false,
  errors: [] as string[],
});
  const [uploadResult, setUploadResult] = useState<{ success: number; updated: number; created: number; errors: string[] } | null>(null)
  const [mediaUploading, setMediaUploading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [banners, setBanners] = useState<Banner[]>([])
  const [bannerForm, setBannerForm] = useState<BannerFormData>(emptyBanner)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [bannerSaving, setBannerSaving] = useState(false)
  const [bannerImageUploading, setBannerImageUploading] = useState(false)
  const [deleteBannerConfirm, setDeleteBannerConfirm] = useState<string | null>(null)
  const [promoBanners, setPromoBanners] = useState<any[]>([])
  const [promoBannerForm, setPromoBannerForm] = useState<any>({
    

  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  emoji: '',
  image_url: '',
  background: 'yellow',
  is_active: true
})
  const [editingPromoBanner, setEditingPromoBanner] = useState<any>(null)
  const [showPromoBannerForm, setShowPromoBannerForm] = useState(false)
  const [promoBannerSaving, setPromoBannerSaving] = useState(false)
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>([])
const [shopCategoryForm, setShopCategoryForm] = useState(emptyShopCategory)
const [editingShopCategory, setEditingShopCategory] = useState<ShopCategory | null>(null)
const [showShopCategoryForm, setShowShopCategoryForm] = useState(false)
const [shopCategorySaving, setShopCategorySaving] = useState(false)
const [deleteShopCategoryConfirm, setDeleteShopCategoryConfirm] = useState<string | null>(null)
const [currentPage, setCurrentPage] = useState(1)
const [productsPerPage, setProductsPerPage] = useState(12)

  const [deletePromoBannerConfirm, setDeletePromoBannerConfirm] = useState<number | null>(null)
  const bannerImageInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const bulkFileRef = useRef<HTMLInputElement>(null)
  const promoBannerImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    if (showForm) closeForm();

    if (showBannerForm) closeBannerForm();

    if (showPromoBannerForm) closePromoBannerForm();

    if (showShopCategoryForm) setShowShopCategoryForm(false);

    if (showBulkUpload) {
      setShowBulkUpload(false);
      setUploadResult(null);
    }

    if (deleteConfirm) setDeleteConfirm(null);

    if (deleteBannerConfirm) setDeleteBannerConfirm(null);

    if (deletePromoBannerConfirm) setDeletePromoBannerConfirm(null);
  };

  window.addEventListener("keydown", handleEsc);

  return () => window.removeEventListener("keydown", handleEsc);
}, [
  showForm,
  showBannerForm,
  showPromoBannerForm,
  showShopCategoryForm,
  showBulkUpload,
  deleteConfirm,
  deleteBannerConfirm,
  deletePromoBannerConfirm,
]);

  const loadData = async () => {
    const [{ data: prods }, { data: cats }, { data: bann }, { data: promoBann }, { data: shopCats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('banners').select('*').order('display_order', { ascending: true }), supabase
        .from('home_promo_banners')
        .select('*')
        .order('sort_order', { ascending: true }),
    supabase
  .from('shop_categories')
  .select('*')
  .order('display_order'),

])
    
    setProducts(prods || [])
    setCategories(cats || [])
    setBanners(bann || [])
    setShopCategories(shopCats || [])
    setPromoBanners(promoBann || [])
    setLoading(false)
  }

  const loadChatMessages = async () => {
    setChatLoading(true)
    const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: false }).limit(200)
    setChatMessages(data || [])
    setChatLoading(false)
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
    setError('')
    setShowForm(true)
  }

  const handleZipClick = () => {
    setShowUploadMenu(false);
    zipInputRef.current?.click();
  };

  const handleZipSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowZipUploadModal(true);
    const file = e.target.files?.[0];

    if (!file) return;
    setZipUpload({
  fileName: file.name,
  total: 0,
  uploaded: 0,
  failed: 0,
  currentFile: "",
  progress: 0,
  completed: false,
  errors: [],
});

    
const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
    alert("ZIP file size must be less than 50 MB.");
    e.target.value = "";
    return;
  }
console.log(file);

  const zip = await JSZip.loadAsync(file);

  console.log("ZIP Contents:");

  Object.keys(zip.files).forEach((fileName) => {
    console.log(fileName);
  });

const imageFiles: any[] = [];

zip.forEach((relativePath: string, zipEntry) => {
  if (
    !zipEntry.dir &&
    /\.(jpg|jpeg|png|webp)$/i.test(zipEntry.name)
  ) {
    imageFiles.push(zipEntry);
  }
});

console.log("Images Found:", imageFiles);
console.log("Total Images:", imageFiles.length);

setZipUpload(prev => ({
  ...prev,
  total: imageFiles.length,
}));

for (const image of imageFiles) {
  
  const blob = await image.async("blob");
  console.log("Image:", image.name);
  console.log(blob);
  const fileName = image.name.split("/").pop() || "";

  
  setZipUpload(prev => ({
  ...prev,
  currentFile: fileName,
}));

  const sku = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/-\d+$/, "");

const match = fileName.match(/-(\d+)\.[^.]+$/);
const imagePosition = match
  ? parseInt(match[1], 10)
  : 1;

  console.log("File:", fileName);
  console.log("SKU:", sku);
  
try {
  const uploadFile = new File(
    [blob],
    fileName,
    {
      type: blob.type || "image/jpeg",
    }
  );

  const { data: existingProduct, error: fetchError } = await supabase
    .from("products")
    .select("image_url, additional_images")
    .eq("sku", sku)
    .single();

    if (!existingProduct) {
  throw new Error(`SKU not found: ${sku}`);
}

const publicUrl = await uploadMedia(uploadFile);
console.log("Cloudinary URL:", publicUrl);

let oldImageUrl: string | null = null;

if (imagePosition === 1) {
  oldImageUrl = existingProduct.image_url;
} else {
  oldImageUrl = existingProduct.additional_images?.[imagePosition - 2] || null;
}

  const updatedImages = [...(existingProduct?.additional_images || [])];
  if (imagePosition === 1) {
  // Main Image
  existingProduct.image_url = publicUrl;
} else {
  // Image 2 onwards
  updatedImages[imagePosition - 2] = publicUrl;
}

  const { error: updateError } = await supabase
    .from("products")
    .update({
      image_url: existingProduct?.image_url || publicUrl,
      additional_images: updatedImages,
    })
    .eq("sku", sku);

  if (!updateError && oldImageUrl) {
  try {
    await deleteMedia(oldImageUrl);
    console.log("Old image deleted:", oldImageUrl);
  } catch (err) {
    console.error("Failed to delete old image:", err);
  }
}  

  if (updateError) {
    console.error("DB Update Error:", updateError);
  } else {
    console.log("Database Updated:", sku);

  setZipUpload(prev => {
  const uploaded = prev.uploaded + 1;
  const processed = uploaded + prev.failed;

  return {
    ...prev,
    uploaded,
    progress: Math.round((processed / prev.total) * 100),
    completed: processed === prev.total,
    currentFile: processed === prev.total ? "" : fileName,
  };
});
  }


} catch (err) {
  console.error("Cloudinary Upload Error:", err);

 setZipUpload(prev => {
  const failed = prev.failed + 1;
  const processed = prev.uploaded + failed;

  return {
    ...prev,
    failed,
    progress: Math.round((processed / prev.total) * 100),
    completed: processed === prev.total,
    currentFile: processed === prev.total ? "" : fileName,
    errors: [
      ...prev.errors,
      `${fileName} failed`,
    ],
  };
});
}

}
};  

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    const specs = product.specifications && product.specifications.length > 0
      ? [...product.specifications]
      : []
    while (specs.length < NUM_SPECS) specs.push('')
    setFormData({
      sku: product.sku || '',
      name: product.name,
      slug: product.slug,
      description: product.description,
      specifications: specs.slice(0, NUM_SPECS),
      price: String(product.price),
      mrp: product.mrp != null ? String(product.mrp) : "",
      price_usd: product.price_usd != null ? String(product.price_usd) : '',
      image_url: product.image_url,
      additional_images: product.additional_images || [],
      video_url: product.video_url || '',
      category_id: product.category_id || '',
      stock_quantity: String(product.stock_quantity ?? 0),
      in_stock: product.in_stock,
      featured: product.featured,
    })
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData(emptyProduct)
    setError('')
  }

  const allFormImages = [formData.image_url, ...formData.additional_images].filter(Boolean)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    const currentCount = allFormImages.length
    const remaining = MAX_IMAGES - currentCount
    if (remaining <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`)
      if (imageInputRef.current) imageInputRef.current.value = ''
      return
    }
    const filesToUpload = files.slice(0, remaining)
    if (files.length > remaining) {
      setError(`Only ${remaining} more image(s) allowed (max ${MAX_IMAGES} total).`)
    } else {
      setError('')
    }
    setMediaUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of filesToUpload) {
        if (!isImageFile(file)) { setError(`"${file.name}" is not a valid image.`); continue }
        const url = await uploadMedia(file)
        uploaded.push(url)
      }
      const newImages = [...allFormImages, ...uploaded]
      setFormData((prev) => ({
        ...prev,
        image_url: newImages[0] || '',
        additional_images: newImages.slice(1),
      }))
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    }
    setMediaUploading(false)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isVideoFile(file)) {
      setError('Please select a valid video file.')
      if (videoInputRef.current) videoInputRef.current.value = ''
      return
    }
    setError('')
    setMediaUploading(true)
    try {
      if (formData.video_url) await deleteMedia(formData.video_url)
      const url = await uploadMedia(file)
      setFormData((prev) => ({ ...prev, video_url: url }))
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    }
    setMediaUploading(false)
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const removeImage = async (index: number) => {
    const images = [...allFormImages]
    const removed = images.splice(index, 1)[0]
    if (removed) await deleteMedia(removed)
    setFormData((prev) => ({
      ...prev,
      image_url: images[0] || '',
      additional_images: images.slice(1),
    }))
  }

const handleReplaceImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number
) => {
  const file = e.target.files?.[0]
  if (!file) return

  try {
    setMediaUploading(true)

    const images = [...allFormImages]
    const oldImage = images[index]

    // Upload new image
    const newImage = await uploadMedia(file)

    // Delete old image from Cloudinary
    if (oldImage) {
      await deleteMedia(oldImage)
    }

    // Replace image in array
    images[index] = newImage

    setFormData(prev => ({
      ...prev,
      image_url: images[0] || "",
      additional_images: images.slice(1),
    }))

    setReplaceIndex(null)

    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }

  } catch (err) {
    setError(String(err instanceof Error ? err.message : err))
  } finally {
    setMediaUploading(false)
  }
}


  const removeVideo = async () => {
    if (formData.video_url) await deleteMedia(formData.video_url)
    setFormData((prev) => ({ ...prev, video_url: '' }))
  }

  const handleSpecChange = (index: number, value: string) => {
    setFormData((prev) => {
      const specs = [...prev.specifications]
      while (specs.length < NUM_SPECS) specs.push('')
      specs[index] = value
      return { ...prev, specifications: specs }
    })
  }

  const handleSave = async () => {
    setError('')
    const sku = formData.sku.trim()
    if (!sku) { setError('SKU is required. Please enter a unique product code.'); return }

    const name = formData.name.trim()
    if (!name) { setError('Product name is required.'); return }

    const price = parseFloat(formData.price)
    const mrp = formData.mrp.trim() ? parseFloat(formData.mrp) : null

if (mrp !== null && (isNaN(mrp) || mrp < 0)) {
  setError('Please enter a valid MRP.')
  return
}
    if (isNaN(price) || price < 0) { setError('Please enter a valid price in Rupees.'); return }

    const priceUsd = formData.price_usd.trim() ? parseFloat(formData.price_usd) : null
    if (priceUsd !== null && (isNaN(priceUsd) || priceUsd < 0)) {
      setError('Please enter a valid Dollar price (or leave blank).')
      return
    }

    const stock = parseInt(formData.stock_quantity || '0', 10)
    const slug = formData.slug.trim() || slugify(name)

    const specs = formData.specifications.map((s) => s.trim()).filter((s) => s.length > 0)

    const payload = {
      sku,
      name,
      slug,
      description: formData.description.trim() || name,
      short_description: specs.length > 0 ? specs.slice(0, 3).join(' • ') : (formData.description.trim().slice(0, 120) || name),
      specifications: specs,
      price,
      mrp: mrp !== null && !isNaN(mrp) ? mrp : null,
      price_usd: priceUsd !== null && !isNaN(priceUsd) ? priceUsd : null,
      image_url: formData.image_url || '',
      additional_images: formData.additional_images,
      video_url: formData.video_url || null,
      category_id: formData.category_id || null,
      stock_quantity: isNaN(stock) ? 0 : Math.max(0, stock),
      in_stock: formData.in_stock,
      featured: formData.featured,
      updated_at: new Date().toISOString(),
    }

    setSaving(true)

    if (!editingProduct) {
      const { data: existing } = await supabase.from('products').select('id').eq('sku', sku).maybeSingle()
      if (existing) {
        const { error: err } = await supabase.from('products').update(payload).eq('id', existing.id)
        if (err) { setError(err.message); setSaving(false); return }
        showSuccess(`SKU "${sku}" already existed — product updated!`)
        setSaving(false)
        closeForm()
        loadData()
        return
      }
    }

    if (editingProduct) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
      if (err) { setError(err.message); setSaving(false); return }
      showSuccess(`"${name}" updated successfully!`)
    } else {
      const { error: err } = await supabase.from('products').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
      showSuccess(`"${name}" added successfully!`)
    }
    setSaving(false)
    closeForm()
    loadData()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    setDeleteConfirm(null)
    showSuccess('Product deleted.')
    loadData()
  }

  const handleSaveCategory = async () => {
    const name = categoryName.trim()
    if (!name) return
    setSavingCategory(true)
    const { error: err } = await supabase.from('categories').insert({ name, slug: slugify(name) })
    if (err) { setError(err.message); setSavingCategory(false); return }
    setCategoryName('')
    setSavingCategory(false)
    loadData()
    showSuccess('Category added.')
  }

  const handleDeleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
    loadData()
    showSuccess('Category deleted.')
  }

  const downloadTemplate = () => {
    const template = [
      {
        sku: 'VT-TEDDY-001',
        name: 'Teddy Bear Plush',
        description: 'A beautifully crafted teddy bear made from premium plush material.',
        spec_1: 'Age: 3+ years',
        spec_2: 'Height: 30 cm',
        spec_3: 'Material: Non-toxic plush',
        spec_4: 'Washable: Yes (hand wash)',
        spec_5: 'Battery: Not required',
        spec_6: 'Safety: BPA-free',
        price_inr: 499,
        mrp: 0,
        image_url: 'https://images.pexels.com/photos/...',
        category: 'Soft Toys',
        stock_quantity: 50,
        in_stock: 'yes',
        featured: 'no',
      },
      {
        sku: 'VT-BLOCKS-002',
        name: 'Wooden Building Blocks',
        description: 'Colorful wooden building blocks for creative play.',
        spec_1: 'Age: 2-8 years',
        spec_2: 'Pieces: 100',
        spec_3: 'Material: Natural wood',
        spec_4: 'Paint: Non-toxic water-based',
        spec_5: 'Storage: Cotton bag included',
        spec_6: 'Safety: EN71 certified',
        price_inr: 699,
        price_usd: 9.99,
        image_url: 'https://images.pexels.com/photos/...',
        category: 'Educational',
        stock_quantity: 30,
        in_stock: 'yes',
        featured: 'yes',
      },
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    ws['!cols'] = [
      { wch: 18 }, { wch: 25 }, { wch: 50 },
      { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 },
      { wch: 14 }, { wch: 14 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'product-upload-template.xlsx')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadResult(null)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
      if (rows.length === 0) {
        setUploadResult({ success: 0, updated: 0, created: 0, errors: ['The file is empty.'] })
        setUploading(false)
        return
      }
      const errors: string[] = []
      const validRows: Record<string, unknown>[] = []
      rows.forEach((row, idx) => {
        const rowNum = idx + 2
        const sku = String(row['sku'] ?? '').trim()
        const name = String(row['name'] ?? '').trim()
        const priceRaw = row['price_inr'] ?? row['price'] ?? row['price_inr (₹)']
        const price = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw ?? ''))
        const mrpRaw =
  row['mrp'] ??
  row['MRP'] ??
  row['mrp (₹)']

const mrp =
  mrpRaw === undefined || mrpRaw === null || String(mrpRaw).trim() === ''
    ? null
    : parseFloat(String(mrpRaw))
        if (!sku) { errors.push(`Row ${rowNum}: Missing SKU (required).`); return }
        if (!name) { errors.push(`Row ${rowNum}: Missing product name.`); return }
        if (isNaN(price) || price < 0) { errors.push(`Row ${rowNum}: Invalid Rupee price for "${name}".`); return }
        validRows.push(row)
        if (mrp !== null && (isNaN(mrp) || mrp < 0)) {
  errors.push(`Row ${rowNum}: Invalid MRP for "${name}".`)
  return
}
      })
      if (validRows.length === 0) {
        setUploadResult({ success: 0, updated: 0, created: 0, errors })
        setUploading(false)
        return
      }
      const categoryNames = new Set<string>()
      validRows.forEach((row) => {
        const catName = String(row['category'] ?? '').trim()
        if (catName) categoryNames.add(catName)
      })
      const categoryNameToId = new Map<string, string>()
      categories.forEach((cat) => categoryNameToId.set(cat.name.toLowerCase(), cat.id))
      for (const catName of categoryNames) {
        if (!categoryNameToId.has(catName.toLowerCase())) {
          const { data: newCat } = await supabase.from('categories').insert({ name: catName, slug: slugify(catName) }).select().single()
          if (newCat) categoryNameToId.set(catName.toLowerCase(), newCat.id)
        }
      }

      const allSkus = validRows.map((row) => String(row['sku']).trim())
      const existingSkuMap = new Map<string, string>()
      if (allSkus.length > 0) {
        const { data: existingProducts } = await supabase.from('products').select('id, sku').in('sku', allSkus)
        if (existingProducts) {
          existingProducts.forEach((p) => {
            if (p.sku) existingSkuMap.set(p.sku, p.id)
          })
        }
      }

      const toInsert: Record<string, unknown>[] = []
      const toUpdate: { id: string; data: Record<string, unknown> }[] = []
      let createdCount = 0
      let updatedCount = 0

      for (const row of validRows) {
        const sku = String(row['sku']).trim()
        const name = String(row['name']).trim()
        const priceRaw = row['price_inr'] ?? row['price'] ?? row['price_inr (₹)']
        const price = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw))
        const mrpRaw =
  row['mrp'] ??
  row['MRP'] ??
  row['mrp (₹)']

const mrp =
  mrpRaw == null || String(mrpRaw).trim() === ''
    ? null
    : parseFloat(String(mrpRaw))
        const usdRaw = row['price_usd'] ?? row['price_usd ($)']
        const priceUsd = usdRaw != null && usdRaw !== '' ? (typeof usdRaw === 'number' ? usdRaw : parseFloat(String(usdRaw))) : null
        const catName = String(row['category'] ?? '').trim()
        const stockRaw = row['stock_quantity']
        const stock = typeof stockRaw === 'number' ? stockRaw : parseInt(String(stockRaw ?? '0'), 10)
        const inStockVal = String(row['in_stock'] ?? 'yes').trim().toLowerCase()
        const featuredVal = String(row['featured'] ?? 'no').trim().toLowerCase()
        const desc = String(row['description'] ?? '').trim()
        const specs = [1, 2, 3, 4, 5, 6].map((n) => String(row[`spec_${n}`] ?? '').trim()).filter((s) => s.length > 0)

        const record = {
          sku,
          name,
          slug: slugify(name),
          description: desc || name,
          short_description: specs.length > 0 ? specs.slice(0, 3).join(' • ') : (desc.slice(0, 120) || name),
          specifications: specs,
          price,
          mrp: mrp,
          price_usd: priceUsd !== null && !isNaN(priceUsd) ? priceUsd : null,
          image_url: String(row['image_url'] ?? '').trim(),
          additional_images: [] as string[],
          video_url: null as string | null,
          category_id: catName ? categoryNameToId.get(catName.toLowerCase()) || null : null,
          stock_quantity: isNaN(stock) ? 0 : Math.max(0, stock),
          in_stock: inStockVal === 'yes' || inStockVal === 'true' || inStockVal === '1',
          featured: featuredVal === 'yes' || featuredVal === 'true' || featuredVal === '1',
          updated_at: new Date().toISOString(),
        }

        if (existingSkuMap.has(sku)) {
          toUpdate.push({ id: existingSkuMap.get(sku)!, data: record })
          updatedCount++
        } else {
          toInsert.push(record)
          createdCount++
        }
      }

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from('products').insert(toInsert)
        if (insertError) {
          errors.push(`Insert error: ${insertError.message}`)
          createdCount = 0
        }
      }
      for (const { id, data } of toUpdate) {
        const { error: updateError } = await supabase.from('products').update(data).eq('id', id)
        if (updateError) {
          errors.push(`Update error for SKU: ${updateError.message}`)
          updatedCount--
        }
      }

      setUploadResult({ success: createdCount + updatedCount, updated: updatedCount, created: createdCount, errors })
      showSuccess(`${createdCount} new, ${updatedCount} updated successfully!`)
      loadData()
    } catch (err) {
      setUploadResult({ success: 0, updated: 0, created: 0, errors: [String(err)] })
    }
    setUploading(false)
    if (bulkFileRef.current) bulkFileRef.current.value = ''
  }

  const downloadProducts = (items: Product[]) => {
    if (items.length === 0) return
    const catIdToName = new Map<string, string>()
    categories.forEach((cat) => catIdToName.set(cat.id, cat.name))
    const rows = items.map((p) => {
      const specs = p.specifications || []
      const row: Record<string, string | number> = {
        sku: p.sku || '',
        name: p.name,
        description: p.description || '',
      }
      for (let i = 0; i < NUM_SPECS; i++) row[`spec_${i + 1}`] = specs[i] || ''
      row.price_inr = p.price
      row.price_usd = p.price_usd ?? ''
      row.image_url = p.image_url || ''
      row.additional_images = (p.additional_images || []).join(', ')
      row.video_url = p.video_url || ''
      row.category = p.category_id ? catIdToName.get(p.category_id) || '' : ''
      row.stock_quantity = p.stock_quantity ?? 0
      row.in_stock = p.in_stock ? 'yes' : 'no'
      row.featured = p.featured ? 'yes' : 'no'
      return row
    })
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [
      { wch: 18 }, { wch: 25 }, { wch: 50 },
      { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 },
      { wch: 14 }, { wch: 14 }, { wch: 40 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 10 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    const dateStr = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `products-export-${dateStr}.xlsx`)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const downloadSelected = () => {
    const selected = products.filter((p) => selectedIds.has(p.id))
    if (selected.length === 0) return
    downloadProducts(selected)
    showSuccess(`${selected.length} product(s) downloaded.`)
  }

  const downloadAll = () => {
    if (products.length === 0) return
    downloadProducts(products)
    showSuccess(`${products.length} product(s) downloaded.`)
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  )
const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))

const indexOfLastProduct = currentPage * productsPerPage
const indexOfFirstProduct = indexOfLastProduct - productsPerPage

const paginatedProducts = filteredProducts.slice(
  indexOfFirstProduct,
  indexOfLastProduct
)
const pageSizeOptions: number[] = []

for (
  let size = 12;
  size <= Math.ceil(filteredProducts.length / 12) * 12;
  size += 12
) {
  pageSizeOptions.push(size)
}
  const openAddBannerForm = () => {
  setEditingBanner(null)

  const nextOrder =
    banners.length > 0
      ? Math.max(...banners.map((b) => b.display_order)) + 1
      : 0

  setBannerForm({
    ...emptyBanner,
    display_order: String(nextOrder),
  })

  setShowBannerForm(true)
}
const openAddShopCategoryForm = () => {
  setEditingShopCategory(null)

  const nextOrder =
    shopCategories.length > 0
      ? Math.max(...shopCategories.map((c) => c.display_order)) + 1
      : 0

  setShopCategoryForm({
    ...emptyShopCategory,
    display_order: String(nextOrder),
  })

  setShowShopCategoryForm(true)
}
const handleShopCategoryImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0]

  if (!file) return

  console.log("FILE:", file)

  try {
    const imageUrl = await uploadMedia(file)

    console.log("IMAGE URL:", imageUrl)

    setShopCategoryForm(prev => ({
      ...prev,
      image_url: imageUrl,
    }))
  } catch (err) {
    console.error("UPLOAD ERROR:", err)
    setError(String(err))
  }
}
  const openAddPromoBannerForm = () => {
    setEditingPromoBanner(null)

  setPromoBannerForm({
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  emoji: '',
  image_url: '',
  background: 'yellow',
  is_active: true
})

    setShowPromoBannerForm(true)
  }
  const openEditBannerForm = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      image_url: banner.image_url || '',
      background_color: banner.background_color || 'linear-gradient(to right, #ef4444, #f59e0b)',
      display_order: String(banner.display_order),
      is_active: banner.is_active,
    })
    setShowBannerForm(true)
  }
  const openEditPromoBannerForm = (banner: any) => {
    setEditingPromoBanner(banner)

setPromoBannerForm({
  title: banner.title,
  subtitle: banner.subtitle,
  button_text: banner.button_text,
  button_link: banner.button_link,
  emoji: banner.emoji,
  image_url: banner.image_url || '',
  background: banner.background,
  is_active: banner.is_active
})

    setShowPromoBannerForm(true)
  }
  const openEditShopCategoryForm = (category: ShopCategory) => {
  setEditingShopCategory(category)

 setShopCategoryForm({
  title: category.title,
  subtitle: category.subtitle || '',
  image_url: category.image_url || '',
  button_text: category.button_text || '',
  button_link: category.button_link || '',
  display_order: String(category.display_order),
  is_active: category.is_active,
})

  setShowShopCategoryForm(true)
}
  const closeBannerForm = () => {
    setShowBannerForm(false)
    setEditingBanner(null)
    setBannerForm(emptyBanner)
    setError('')
  }
  const closePromoBannerForm = () => {
    setShowPromoBannerForm(false)
    setEditingPromoBanner(null)

setPromoBannerForm({
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  emoji: '',
  image_url: '',
  background: 'yellow',
  is_active: true
})
  }
  const closeShopCategoryForm = () => {
  setShowShopCategoryForm(false)
  setEditingShopCategory(null)

  setShopCategoryForm(emptyShopCategory)

  setError('')
}
  const handleSavePromoBanner = async () => {
  setError('')

  const title = promoBannerForm.title.trim()

  if (!title) {
    setError('Banner title is required.')
    return
  }

  const activePromoCount = promoBanners.filter(
    (b: any) => b.is_active && b.id !== editingPromoBanner?.id
  ).length

  if (promoBannerForm.is_active && activePromoCount >= 2) {
    setError('Maximum 2 active promo banners are allowed.')
    return
  }

  const payload = {
    title,
    subtitle: promoBannerForm.subtitle.trim(),
    button_text: promoBannerForm.button_text.trim(),
    button_link: promoBannerForm.button_link.trim(),
    emoji: promoBannerForm.emoji.trim(),
    image_url: promoBannerForm.image_url,
    background: promoBannerForm.background,
    is_active: promoBannerForm.is_active,
  }
console.log("PROMO PAYLOAD:", payload)
  setBannerSaving(true)

  if (editingPromoBanner) {
    const { error } = await supabase
      .from('home_promo_banners')
      .update(payload)
      .eq('id', editingPromoBanner.id)

    if (error) {
      setError(error.message)
      setBannerSaving(false)
      return
    }

    showSuccess('Promo banner updated!')
  } else {
    const { error } = await supabase
      .from('home_promo_banners')
      .insert(payload)

    if (error) {
      setError(error.message)
      setBannerSaving(false)
      return
    }

    showSuccess('Promo banner created!')
  }

  setBannerSaving(false)
  closePromoBannerForm()
  loadData()
}
const handleDeletePromoBanner = async () => {

  if (deletePromoBannerConfirm === null) return

  const { error } = await supabase
    .from("home_promo_banners")
    .delete()
    .eq("id", deletePromoBannerConfirm)

  if (error) {
    setError(error.message)
    return
  }

  showSuccess("Promo banner deleted!")

  setDeletePromoBannerConfirm(null)

  loadData()
}
const handleSaveShopCategory = async () => {
  setError('')

  const title = shopCategoryForm.title.trim()

  if (!title) {
    setError('Category title is required.')
    return
  }

  const activeCategoryCount = shopCategories.filter(
    (c) => c.is_active && c.id !== editingShopCategory?.id
  ).length

  if (shopCategoryForm.is_active && activeCategoryCount >= 5) {
    setError('Maximum 5 active categories are allowed.')
    return
  }

  const payload = {
    title,
    image_url: shopCategoryForm.image_url.trim() || null,
    subtitle: shopCategoryForm.subtitle.trim() || null,
    button_text: shopCategoryForm.button_text.trim() || null,
    button_link: shopCategoryForm.button_link.trim() || null,
    display_order: parseInt(shopCategoryForm.display_order || '0', 10),
    is_active: shopCategoryForm.is_active,
    updated_at: new Date().toISOString(),
  }

  setShopCategorySaving(true)
  if (editingShopCategory) {
  const { error } = await supabase
    .from('shop_categories')
    .update(payload)
    .eq('id', editingShopCategory.id)

  if (error) {
    setError(error.message)
    setShopCategorySaving(false)
    return
  }

  showSuccess(`"${title}" category updated!`)
} else {
  const { error } = await supabase
    .from('shop_categories')
    .insert(payload)

  if (error) {
    setError(error.message)
    setShopCategorySaving(false)
    return
  }

  showSuccess(`"${title}" category created!`)
}

setShopCategorySaving(false)
closeShopCategoryForm()
loadData()
}
  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isImageFile(file)) {
      setError('Please select a valid image file.')
      if (bannerImageInputRef.current) bannerImageInputRef.current.value = ''
      return
    }
    setError('')
    setBannerImageUploading(true)
    try {
      if (bannerForm.image_url) await deleteMedia(bannerForm.image_url)
      const url = await uploadMedia(file)
      setBannerForm((prev) => ({ ...prev, image_url: url }))
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    }
    setBannerImageUploading(false)
    if (bannerImageInputRef.current) bannerImageInputRef.current.value = ''
  }

 const handlePromoBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("STEP-1 handlePromoBannerImageUpload called")
    const file = e.target.files?.[0]
    if (!file) return
    if (!isImageFile(file)) {
      setError('Please select a valid image file.')
    if (promoBannerImageInputRef.current) promoBannerImageInputRef.current.value = ''
      return
    }
    setError('')
    setBannerImageUploading(true)
    try {
      if (promoBannerForm.image_url) await deleteMedia(promoBannerForm.image_url)
      const url = await uploadMedia(file)
    console.log("Uploaded URL =", url)
      setPromoBannerForm((prev: any) => ({ ...prev, image_url: url }))
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    }
    setBannerImageUploading(false)
    if (promoBannerImageInputRef.current) promoBannerImageInputRef.current.value = ''
  }
const removePromoBannerImage = async () => {
  if (promoBannerForm.image_url) {
    await deleteMedia(promoBannerForm.image_url)
  }

  setPromoBannerForm((prev: any) => ({
    ...prev,
    image_url: ''
  }))

  if (promoBannerImageInputRef.current) {
    promoBannerImageInputRef.current.value = ''
  }
}
  const removeBannerImage = async () => {
    if (bannerForm.image_url) await deleteMedia(bannerForm.image_url)
    setBannerForm((prev) => ({ ...prev, image_url: '' }))
  }

  const handleSaveBanner = async () => {
    setError('')
    const title = bannerForm.title.trim()
    if (!title) { setError('Banner title is required.'); return }
    const activeBannerCount = banners.filter(
      (b) => b.is_active && b.id !== editingBanner?.id
    ).length

    if (bannerForm.is_active && activeBannerCount >= 5) {
      setError(
        'Maximum 5 active banners are allowed. Please deactivate another banner first.'
      )
      return
    }
    const payload = {
      title,
      subtitle: bannerForm.subtitle.trim() || null,
      button_text: bannerForm.button_text.trim() || null,
      button_link: bannerForm.button_link.trim() || null,
      image_url: bannerForm.image_url || null,
      background_color: bannerForm.background_color.trim() || null,
      display_order: parseInt(bannerForm.display_order || '0', 10),
      is_active: bannerForm.is_active,
      updated_at: new Date().toISOString(),
    }

    setBannerSaving(true)
    if (editingBanner) {
      const { error: err } = await supabase.from('banners').update(payload).eq('id', editingBanner.id)
      if (err) { setError(err.message); setBannerSaving(false); return }
      showSuccess(`"${title}" banner updated!`)
    } else {
      const { error: err } = await supabase.from('banners').insert(payload)
      if (err) { setError(err.message); setBannerSaving(false); return }
      showSuccess(`"${title}" banner created!`)
    }
    setBannerSaving(false)
    closeBannerForm()
    loadData()
  }
  const handleDeleteBanner = async (id: string) => {
    const banner = banners.find((b) => b.id === id)
    if (banner?.image_url) await deleteMedia(banner.image_url)
    await supabase.from('banners').delete().eq('id', id)
    setDeleteBannerConfirm(null)
    showSuccess('Banner deleted.')
    loadData()
  }
const handleDeleteShopCategory = async (id: string) => {
  const category = shopCategories.find((c) => c.id === id)

  if (category?.image_url) {
    await deleteMedia(category.image_url)
  }

  const { error } = await supabase
    .from('shop_categories')
    .delete()
    .eq('id', id)

  if (error) {
    setError(error.message)
    return
  }

  setDeleteShopCategoryConfirm(null)
  showSuccess('Category deleted.')
  loadData()
}
  const moveBanner = async (banner: Banner, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex((b) => b.id === banner.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const swapBanner = sorted[swapIdx]
    const updates = [
      { id: banner.id, display_order: swapBanner.display_order, updated_at: new Date().toISOString() },
      { id: swapBanner.id, display_order: banner.display_order, updated_at: new Date().toISOString() },
    ]
    for (const u of updates) {
      await supabase.from('banners').update({ display_order: u.display_order, updated_at: u.updated_at }).eq('id', u.id)
    }
    loadData()
  }
const moveShopCategory = async (
  category: ShopCategory,
  direction: 'up' | 'down'
) => {
  const sorted = [...shopCategories].sort(
    (a, b) => a.display_order - b.display_order
  )

  const idx = sorted.findIndex((c) => c.id === category.id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1

  if (swapIdx < 0 || swapIdx >= sorted.length) return

  const swapCategory = sorted[swapIdx]

  const updates = [
    {
      id: category.id,
      display_order: swapCategory.display_order,
      updated_at: new Date().toISOString(),
    },
    {
      id: swapCategory.id,
      display_order: category.display_order,
      updated_at: new Date().toISOString(),
    },
  ]

  for (const u of updates) {
    await supabase
      .from('shop_categories')
      .update({
        display_order: u.display_order,
        updated_at: u.updated_at,
      })
      .eq('id', u.id)
  }

  loadData()
}
const movePromoBannerUp = async (banner: any) => {
  console.log("UP CLICK", banner)
  const sorted = [...promoBanners].sort(
    (a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id)
  )

  const index = sorted.findIndex(b => b.id === banner.id)
  if (index <= 0) return

  const current = sorted[index]
  const previous = sorted[index - 1]
  console.log("Current:", current)
console.log("Previous:", previous)
console.log("Sorted:", sorted)

  const { error: err1 } = await supabase
  .from("home_promo_banners")
  .update({ sort_order: previous.sort_order })
  .eq("id", current.id)

console.log("ERR1:", err1)

  const { error: err2 } = await supabase
  .from("home_promo_banners")
  .update({ sort_order: current.sort_order })
  .eq("id", previous.id)

console.log("ERR2:", err2)

  loadData()
}

const movePromoBannerDown = async (banner: any) => {
  console.log("DOWN CLICK", banner)
  const sorted = [...promoBanners].sort(
    (a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id)
  )

  const index = sorted.findIndex(b => b.id === banner.id)
  if (index >= sorted.length - 1) return

  const current = sorted[index]
  const next = sorted[index + 1]
  console.log("Current:", current)
console.log("Next:", next)
console.log("Sorted:", sorted)

  const { error: err3 } = await supabase
  .from("home_promo_banners")
  .update({ sort_order: next.sort_order })
  .eq("id", current.id)

console.log("ERR3:", err3)

  const { error: err4 } = await supabase
  .from("home_promo_banners")
  .update({ sort_order: current.sort_order })
  .eq("id", next.id)

console.log("ERR4:", err4)

  loadData()
}
  const toggleBannerActive = async (banner: Banner) => {
    if (!banner.is_active) {
      const activeBannerCount = banners.filter((b) => b.is_active).length

      if (activeBannerCount >= 5) {
        setError(
          'Maximum 5 active banners are allowed. Please deactivate another banner first.'
        )
        return
      }
    }
    await supabase.from('banners').update({ is_active: !banner.is_active, updated_at: new Date().toISOString() }).eq('id', banner.id)
    loadData()
  }
  const togglePromoBannerActive = async (banner: any) => {
    console.log("Eye clicked", banner)
  if (!banner.is_active) {
    const activeCount = promoBanners.filter((b: any) => b.is_active).length

    if (activeCount >= 2) {
      setError(
        'Maximum 2 active promo banners are allowed. Please deactivate another promo banner first.'
      )
      return
    }
  }

  const { data, error } = await supabase
  .from('home_promo_banners')
  .update({
    is_active: !banner.is_active,
  })
  .eq('id', banner.id)
  .select()

console.log("Banner ID:", banner.id)
console.log("Updated Data:", data)
if (error) {
  console.log("ERROR CODE:", error.code)
  console.log("ERROR MESSAGE:", error.message)
  console.log("ERROR DETAILS:", error.details)
  console.log("ERROR HINT:", error.hint)
}

loadData()
}
const toggleShopCategoryActive = async (category: ShopCategory) => {
  if (!category.is_active) {
    const activeCount = shopCategories.filter((c) => c.is_active).length

    if (activeCount >= 5) {
      setError(
        'Maximum 5 active categories are allowed. Please deactivate another category first.'
      )
      return
    }
  }

  const { error } = await supabase
    .from('shop_categories')
    .update({
      is_active: !category.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', category.id)

  if (error) {
    setError(error.message)
    return
  }

  loadData()
}
  const inquiryCount = chatMessages.filter((m) => m.is_inquiry && m.sender === 'customer').length

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading admin...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      <div className="sticky top-16 z-30 bg-gray-50 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {([['products', 'Products', Package], ['categories', 'Categories', FolderTree], ['banners', 'Banners', GalleryVertical], ['promo_banners', 'Home Promo Banners', ImageIcon], ['shop_categories', 'Shop by Category', Grid2x2], ['inquiries', `Inquiries${inquiryCount > 0 ? ` (${inquiryCount})` : ''}`, MessageCircle]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => { setTab(key); if (key === 'inquiries') loadChatMessages() }}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${tab === key ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search by name or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
            </div>
            <div className="relative">
  <button
    onClick={() => setShowUploadMenu(!showUploadMenu)}
    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
  >
    <Upload size={18} />
    Upload
    <ChevronDown size={16} />
  </button>

  {showUploadMenu && (
    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      <button
        onClick={() => {
          setShowUploadMenu(false);
          setShowBulkUpload(true);
        }}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
      >
        📄 Upload File
      </button>

      <button
       onClick={handleZipClick}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
      >
        📦 Upload ZIP
      </button>
    </div>
  )}
</div>
            <button onClick={downloadSelected} disabled={selectedIds.size === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
              <Download size={18} /> Download{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
            </button>
            <button onClick={openAddForm}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">
              <Plus size={18} /> Add New Product
            </button>
          </div>
        )}

        {tab === 'products' && filteredProducts.length > 0 && (
          <div className="pt-3 flex items-center gap-2">
            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
              {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? <CheckSquare size={18} className="text-red-500" /> : <Square size={18} />}
              {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selectedIds.size > 0 && <span className="text-xs text-gray-400">{selectedIds.size} selected</span>}
          </div>
        )}
      </div>

      {tab === 'products' && (
        <div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No products found.</p>
              <button onClick={openAddForm} className="mt-4 text-red-500 font-medium hover:underline">Add your first product</button>
            </div>
          )}
          {filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl p-4 border transition-shadow ${selectedIds.has(product.id) ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-100 hover:shadow-md'}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleSelect(product.id)} className="mt-1 flex-shrink-0">
                      {selectedIds.has(product.id) ? <CheckSquare size={20} className="text-red-500" /> : <Square size={20} className="text-gray-300 hover:text-gray-400" />}
                    </button>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🧸</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                      {product.sku && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Tag size={10} /> {product.sku}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-red-500">{formatPrice(product.price)}</span>
                          {product.price_usd != null && <span className="text-sm font-semibold text-gray-400">{formatPriceUsd(product.price_usd)}</span>}
                        </div>
                        <span className="text-xs text-gray-500">Stock: {product.stock_quantity}</span>
                      </div>
                    </div>
                  </div>
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.specifications.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{spec}</span>
                      ))}
                      {product.specifications.length > 3 && <span className="text-xs text-gray-400 px-1 py-0.5">+{product.specifications.length - 3} more</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {product.featured && <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><Star size={10} fill="currentColor" /> Featured</span>}
                    {product.video_url && <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"><Video size={10} /> Video</span>}
                    {product.in_stock ? <span className="text-xs text-green-600">In Stock</span> : <span className="text-xs text-red-500">Out of Stock</span>}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEditForm(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(product.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

{filteredProducts.length > 0 && (
  <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">

    {/* Left */}
    <div className="text-sm text-gray-500">
      Showing{" "}
      <span className="font-semibold">
        {Math.min(
          (currentPage - 1) * productsPerPage + 1,
          filteredProducts.length
        )}
      </span>
      {" - "}
      <span className="font-semibold">
        {Math.min(currentPage * productsPerPage, filteredProducts.length)}
      </span>
      {" of "}
      <span className="font-semibold">{filteredProducts.length}</span>
      {" products"}
    </div>

    {/* Right */}
    <div className="flex items-center gap-3">

      <span className="text-sm font-medium text-gray-600">
    Rows:
</span>

      <select
        value={productsPerPage}
        onChange={(e) => {
          setProductsPerPage(Number(e.target.value))
          setCurrentPage(1)
        }}
        className="
w-24
border
border-gray-300
rounded-xl
px-3
py-2
bg-white
shadow-sm
text-sm
font-medium
focus:ring-2
focus:ring-red-400
focus:border-red-400
outline-none
"
      >
        {Array.from(
          {
            length: Math.ceil(filteredProducts.length / 12)
          },
          (_, i) => (i + 1) * 12
        ).map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <button
        disabled={currentPage === 1}
        onClick={() => {
    setCurrentPage((p) => p - 1)

    window.scrollTo({
        top: 120,
        behavior: "smooth",
    })
}}
        className="px-3 py-2 border rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm font-medium">
        Page {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => {
    setCurrentPage((p) => p + 1)

    window.scrollTo({
        top: 120,
        behavior: "smooth",
    })
}}
        className="px-3 py-2 border rounded-lg disabled:opacity-40"
      >
        Next
      </button>

    </div>

  </div>
)}

      {tab === 'categories' && (
        <div className="max-w-md">
          <div className="flex gap-2 mb-6">
            <input placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
            <button onClick={handleSaveCategory} disabled={savingCategory || !categoryName.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all">
              <Plus size={18} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
                <div>
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{cat.slug}</span>
                </div>
                <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-gray-400 text-sm">No categories yet.</p>}
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Homepage Banners</h2>
              <p className="text-sm text-gray-500 mt-1">Manage the slides in your homepage hero slider. Drag-free reorder with the arrows.</p>
            </div>
            <button onClick={openAddBannerForm}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">
              <Plus size={18} /> Add Banner
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <GalleryVertical size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No banners yet.</p>
              <button onClick={openAddBannerForm} className="mt-4 text-red-500 font-medium hover:underline">Add your first banner</button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...banners].sort((a, b) => a.display_order - b.display_order).map((banner, idx, arr) => (
                <div key={banner.id} className={`bg-white rounded-xl p-4 border ${banner.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveBanner(banner, 'up')} disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ArrowUp size={16} />
                      </button>
                      <button onClick={() => moveBanner(banner, 'down')} disabled={idx === arr.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" style={banner.image_url ? { backgroundImage: `url(${banner.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: banner.background_color || '#ef4444' }}>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800 truncate">{banner.title}</h3>
                        <span className="text-xs text-gray-400">#{banner.display_order}</span>
                      </div>
                      {banner.subtitle && <p className="text-sm text-gray-500 truncate">{banner.subtitle}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {banner.button_text && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{banner.button_text}</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${banner.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {banner.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleBannerActive(banner)} title={banner.is_active ? 'Hide banner' : 'Show banner'}
                        className={`p-2 rounded-lg transition-colors ${banner.is_active
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                      >
                        {banner.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => openEditBannerForm(banner)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteBannerConfirm(banner.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'promo_banners' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Home Promo Banners
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage the two promotional banners shown below the homepage slider.
              </p>
            </div>

            <button
              onClick={openAddPromoBannerForm}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl"
            >
              <Plus size={18} />
              Add Promo Banner
            </button>
          </div>

          <p className="text-gray-500">
            <div className="space-y-4">
              {promoBanners.map((banner: any, index: number) => (
                <div
                  key={banner.id}
                  className="bg-white border rounded-xl p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">

  <div className="flex flex-col mr-2">
    <button
  onClick={() => movePromoBannerUp(banner)}
  disabled={index === 0}
  className={`p-1 ${
    index === 0
      ? "text-gray-300 cursor-not-allowed"
      : "text-gray-400 hover:text-orange-500"
  }`}
  title="Move Up"
    >
      <ArrowUp size={18} />
    </button>

    <button
      onClick={() => movePromoBannerDown(banner)}
  disabled={index === promoBanners.length - 1}
  className={`p-1 ${
    index === promoBanners.length - 1
      ? "text-gray-300 cursor-not-allowed"
      : "text-gray-400 hover:text-orange-500"
  }`}
      title="Move Down"
    >
      <ArrowDown size={18} />
    </button>
  </div>

  <div
  className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
  style={
    banner.image_url
      ? {
          backgroundImage: `url(${banner.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}
  }
>
  {!banner.image_url && (
    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
      No Image
    </div>
  )}
</div>

  <div>
    <h3 className="text-lg font-bold">
      {banner.title}
    </h3>

    <p className="text-gray-500">
      {banner.subtitle}
    </p>

    <p className="text-sm text-orange-600 mt-2">
      Button: {banner.button_text}
    </p>
  </div>

</div>

                  <div className="flex gap-2">
                    <button
  onClick={() => openEditPromoBannerForm(banner)}
  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
>
  <Pencil size={16} />
</button>

<button
  onClick={() => togglePromoBannerActive(banner)}
  title={banner.is_active ? "Hide Promo Banner" : "Show Promo Banner"}
  className={`p-2 rounded-lg ${
    banner.is_active
      ? "bg-green-100 text-green-600 hover:bg-green-200"
      : "bg-red-100 text-red-600 hover:bg-red-200"
  }`}
>
  {banner.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
</button>
                    <button
  onClick={() => setDeletePromoBannerConfirm(banner.id)}
  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            

              {deleteBannerConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="text-red-500" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Delete this banner?</h3>
                    <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setDeleteBannerConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                      <button onClick={() => handleDeleteBanner(deleteBannerConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              )}
              {deletePromoBannerConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="text-red-500" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Delete this promo banner?</h3>
                    <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setDeletePromoBannerConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                      <button onClick={() => handleDeletePromoBanner()} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </p>
        </div>
      )}
{tab === 'shop_categories' && (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          Shop by Category
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the 5 homepage category cards.
        </p>
      </div>

      <button
        onClick={openAddShopCategoryForm}
  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl"
>
  <Plus size={18} />
  Add Category
      </button>
    </div>
  <div className="space-y-3">
  {[...shopCategories]
    .sort((a, b) => a.display_order - b.display_order)
    .map((category, idx, arr) => (
      <div
        key={category.id}
        className={`bg-white rounded-xl p-4 border ${
          category.is_active
            ? "border-gray-100"
            : "border-gray-200 opacity-60"
        }`}
      >
        <div className="flex items-center gap-4">

          {/* Move Up / Down */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => moveShopCategory(category, "up")}
              disabled={idx === 0}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <ArrowUp size={16} />
            </button>

            <button
              onClick={() => moveShopCategory(category, "down")}
              disabled={idx === arr.length - 1}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Image */}
          <div
            className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
            style={
              category.image_url
                ? {
                    backgroundImage: `url(${category.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          />

          {/* Details */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800 truncate">
                {category.title}
              </h3>

              <span className="text-xs text-gray-400">
                #{category.display_order}
              </span>
            </div>

            {category.subtitle && (
              <p className="text-sm text-gray-500 truncate">
                {category.subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1">

              {category.button_text && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {category.button_text}
                </span>
              )}

              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  category.is_active
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {category.is_active ? "Active" : "Hidden"}
              </span>

            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => toggleShopCategoryActive(category)}
              title={category.is_active ? "Hide Category" : "Show Category"}
              className={`p-2 rounded-lg transition-colors ${
                category.is_active
                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {category.is_active ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} />
              )}
            </button>

            <button
              onClick={() => openEditShopCategoryForm(category)}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => setDeleteShopCategoryConfirm(category.id)}
              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>
      </div>
    ))}
  </div>
</div>
      )}
      {tab === 'inquiries' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Customer Chat Inquiries</h2>
              <p className="text-sm text-gray-500 mt-1">Questions from the chatbot that need follow-up are highlighted.</p>
            </div>
            <button onClick={loadChatMessages} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
              <MessageCircle size={16} /> Refresh
            </button>
          </div>

          {chatLoading ? (
            <div className="text-center py-16 text-gray-400">Loading messages...</div>
          ) : chatMessages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No chat messages yet.</p>
              <p className="text-sm mt-1">When customers use the chat widget, their conversations will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                chatMessages.reduce((acc, msg) => {
                  if (!acc[msg.session_id]) acc[msg.session_id] = []
                  acc[msg.session_id].push(msg)
                  return acc
                }, {} as Record<string, ChatMessage[]>)
              ).map(([sessionId, msgs]) => {
                const hasInquiry = msgs.some((m) => m.is_inquiry && m.sender === 'customer')
                const firstMsg = msgs[0]
                return (
                  <div key={sessionId} className={`bg-white rounded-xl p-4 border ${hasInquiry ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">{sessionId.slice(0, 12)}...</span>
                        {hasInquiry && <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full"><AlertCircle size={10} /> Needs Follow-up</span>}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(firstMsg.created_at).toLocaleString()}</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {msgs.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.sender === 'customer' ? 'bg-red-50 text-gray-700' : 'bg-gray-100 text-gray-600'}`}>
                            <span className="text-xs font-medium text-gray-400 block mb-0.5">{msg.sender === 'customer' ? 'Customer' : 'Bot'}</span>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
{showBannerForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                      <button onClick={closeBannerForm} className="p-2 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. Welcome to VeehaanToys" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <textarea value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                          rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none resize-none" placeholder="Supporting text shown under the title" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                          <input value={bannerForm.button_text} onChange={(e) => setBannerForm({ ...bannerForm, button_text: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. Shop Now" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                          <input value={bannerForm.button_link} onChange={(e) => setBannerForm({ ...bannerForm, button_link: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. /shop" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (optional)</label>
                        {bannerForm.image_url ? (
                          <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                            <img src={bannerForm.image_url} alt="Banner preview" className="w-full h-40 object-cover" />
                            <button type="button" onClick={removeBannerImage}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => bannerImageInputRef.current?.click()} disabled={bannerImageUploading}
                            className="w-full py-8 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50">
                            {bannerImageUploading ? <Loader2 size={20} className="animate-spin" /> : <><ImageIcon size={20} /><span className="text-sm">Upload Background Image</span></>}
                          </button>
                        )}
                        <input ref={bannerImageInputRef} type="file" accept="image/*" onChange={handleBannerImageUpload} className="hidden" />
                        <p className="text-xs text-gray-400 mt-1">If set, the image replaces the gradient. Max 5MB.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color / Gradient</label>
                        <input value={bannerForm.background_color} onChange={(e) => setBannerForm({ ...bannerForm, background_color: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none font-mono text-sm" placeholder="linear-gradient(to right, #ef4444, #f59e0b)" />
                        <p className="text-xs text-gray-400 mt-1">Used when no image is set. Accepts any CSS color or gradient.</p>
                        <div className="mt-2 h-12 rounded-lg" style={{ background: bannerForm.background_color || '#ef4444' }} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <input type="number" value={bannerForm.display_order} onChange={(e) => setBannerForm({ ...bannerForm, display_order: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="0" />
                          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Active</label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={bannerForm.is_active} onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                              className="w-5 h-5 accent-red-500" />
                            <span className="text-sm text-gray-700">Show this banner on the homepage</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={closeBannerForm} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={handleSaveBanner} disabled={bannerSaving || bannerImageUploading}
                          className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all">
                          {bannerSaving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
       {showShopCategoryForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Add Shop Category
        </h2>

        <button
          onClick={() => setShowShopCategoryForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
<div className="space-y-4">

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Category Title
    </label>

    <input
      value={shopCategoryForm.title}
      onChange={(e) =>
        setShopCategoryForm({
          ...shopCategoryForm,
          title: e.target.value,
        })
      }
      className="w-full border rounded-xl px-4 py-3"
      placeholder="e.g. Educational Toys"
    />
  </div>
  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Subtitle
  </label>

  <textarea
    value={shopCategoryForm.subtitle}
    onChange={(e) =>
      setShopCategoryForm({
        ...shopCategoryForm,
        subtitle: e.target.value,
      })
    }
    className="w-full border rounded-xl px-4 py-3"
    rows={2}
    placeholder="Supporting text shown under the title"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Category Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleShopCategoryImageUpload}
    className="w-full border rounded-xl px-4 py-3"
  />

  {shopCategoryForm.image_url && (
    <img
      src={shopCategoryForm.image_url}
      alt="Preview"
      className="mt-3 w-32 h-20 object-cover rounded-lg border"
    />
  )}
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Button Text
  </label>

  <input
    value={shopCategoryForm.button_text}
    onChange={(e) =>
      setShopCategoryForm({
        ...shopCategoryForm,
        button_text: e.target.value,
      })
    }
    className="w-full border rounded-xl px-4 py-3"
    placeholder="e.g. Shop Now"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Button Link
  </label>

  <input
    value={shopCategoryForm.button_link}
    onChange={(e) =>
      setShopCategoryForm({
        ...shopCategoryForm,
        button_link: e.target.value,
      })
    }
    className="w-full border rounded-xl px-4 py-3"
    placeholder="/shop?category=educational"
  />
</div>
</div>

<div className="flex gap-3 pt-6">
</div>
<div className="flex justify-end gap-3 pt-6">
  <button
    type="button"
    onClick={closeShopCategoryForm}
    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleSaveShopCategory}
    disabled={shopCategorySaving}
    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
  >
    {shopCategorySaving ? 'Saving...' : 'Save Category'}
  </button>
</div>
    </div>
  </div>
)}


      {showPromoBannerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingPromoBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={closePromoBannerForm} className="p-2 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={promoBannerForm.title} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. Welcome to VeehaanToys" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea value={promoBannerForm.subtitle} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, subtitle: e.target.value })}
                  rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none resize-none" placeholder="Supporting text shown under the title" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input value={promoBannerForm.button_text} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, button_text: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. Shop Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input value={promoBannerForm.button_link} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, button_link: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. /shop" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (optional)</label>
                {promoBannerForm.image_url ? (
                  <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={promoBannerForm.image_url} alt="Banner preview" className="w-full h-40 object-cover" />
                    <button type="button" onClick={removePromoBannerImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => promoBannerImageInputRef.current?.click()} disabled={bannerImageUploading}
                    className="w-full py-8 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50">
                    {bannerImageUploading ? <Loader2 size={20} className="animate-spin" /> : <><ImageIcon size={20} /><span className="text-sm">Upload Background Image</span></>}
                  </button>
                )}
                <input ref={promoBannerImageInputRef} type="file" accept="image/*" onChange={handlePromoBannerImageUpload} className="hidden" />
                <p className="text-xs text-gray-400 mt-1">If set, the image replaces the gradient. Max 5MB.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color / Gradient</label>
                <input value={promoBannerForm.background_color} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, background_color: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none font-mono text-sm" placeholder="linear-gradient(to right, #ef4444, #f59e0b)" />
                <p className="text-xs text-gray-400 mt-1">Used when no image is set. Accepts any CSS color or gradient.</p>
                <div className="mt-2 h-12 rounded-lg" style={{ background: promoBannerForm.background_color || '#ef4444' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={promoBannerForm.display_order} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, display_order: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="0" />
                  <p className="text-xs text-gray-400 mt-1">Lower numbers appear first.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Active</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={promoBannerForm.is_active} onChange={(e) => setPromoBannerForm({ ...promoBannerForm, is_active: e.target.checked })}
                      className="w-5 h-5 accent-red-500" />
                    <span className="text-sm text-gray-700">Show this banner on the homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={closePromoBannerForm} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleSavePromoBanner} disabled={bannerSaving || bannerImageUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all">
                  {bannerSaving ? 'Saving...' : editingPromoBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteBannerConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete this banner?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteBannerConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteBanner(deleteBannerConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU * <span className="text-red-500 font-normal">(required — unique product code)</span></label>
                <input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none font-mono text-sm" placeholder="e.g. VT-TEDDY-001" />
                <p className="text-xs text-gray-400 mt-1">If this SKU already exists, the existing product will be updated with the new information.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="e.g. Teddy Bear Plush" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (optional)</label>
                <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="auto-generated from name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Specifications ({NUM_SPECS} max)</label>
                <p className="text-xs text-gray-400 mb-2">Enter up to {NUM_SPECS} key specs. These appear as a numbered list on the product page (e.g. "Age: 3+ years", "Material: Non-toxic plastic").</p>
                <div className="space-y-2">
                  {Array.from({ length: NUM_SPECS }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <input
                        value={formData.specifications[i] || ''}
                        onChange={(e) => handleSpecChange(i, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none text-sm"
                        placeholder={`Specification ${i + 1} (e.g. ${i === 0 ? 'Age: 3+ years' : i === 1 ? 'Material: Non-toxic' : '...'})`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none resize-none" placeholder="Full product description" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price - Rupees (₹) *</label>
                  <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 bg-orange-50 focus:border-orange-500 focus:outline-none" placeholder="499.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                  <input type="number" step="0.01" min="0" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-green-200 bg-green-50 focus:border-green-500 focus:outline-none" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input type="number" min="0" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" placeholder="50" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images (up to {MAX_IMAGES})</label>
                  <span className="text-xs text-gray-400">{allFormImages.length}/{MAX_IMAGES}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allFormImages.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">Main</span>}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {allFormImages.length < MAX_IMAGES && (
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={mediaUploading}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50">
                      {mediaUploading ? <Loader2 size={20} className="animate-spin" /> : <><ImageIcon size={20} /><span className="text-xs">Add Image</span></>}
                    </button>
                  )}
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={(e) => {
  if (replaceIndex !== null) {
    handleReplaceImage(e, replaceIndex)
  } else {
    handleImageUpload(e)
  }
}} className="hidden" />
                <p className="text-xs text-gray-400 mt-1">First image is the main image. Max 5MB per image.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Video (optional, 1 video)</label>
                {formData.video_url ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-900">
                    <video src={formData.video_url} className="w-full h-32 object-cover" />
                    <button type="button" onClick={removeVideo}
                      className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => videoInputRef.current?.click()} disabled={mediaUploading}
                    className="w-full py-6 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50">
                    {mediaUploading ? <Loader2 size={20} className="animate-spin" /> : <><Video size={20} /><span className="text-sm">Upload Video</span></>}
                  </button>
                )}
                <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                <p className="text-xs text-gray-400 mt-1">Max 50MB. MP4, WebM recommended.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none bg-white">
                  <option value="">No category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.in_stock} onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="w-5 h-5 accent-red-500" />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent-red-500" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeForm} className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || mediaUploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBulkUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Bulk Upload Products</h2>
              <button onClick={() => { setShowBulkUpload(false); setUploadResult(null) }} className="p-2 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Upload an Excel file (.xlsx) with your products. Download the template first to see the required format.</p>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the template using the button below</li>
                  <li>Fill in your product data (one row per product)</li>
                  <li>Upload the filled file below</li>
                  <li>New categories in the file are created automatically</li>
                  <li>Required columns: <strong>sku</strong>, <strong>name</strong>, and <strong>price_inr</strong></li>
                  <li>Optional: description, <strong>spec_1</strong>–<strong>spec_6</strong>, price_usd, image_url, category, stock_quantity, in_stock, featured</li>
                  <li>Use "yes"/"no" for in_stock and featured columns</li>
                </ol>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="font-semibold text-blue-700 mb-1">SKU behavior:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>If a row's <strong>sku</strong> matches an existing product, that product is <strong>updated</strong> with the new data.</li>
                    <li>If the <strong>sku</strong> is new, a <strong>new product</strong> is created.</li>
                    <li>Rows without an SKU will be <strong>rejected</strong> — SKU is required.</li>
                  </ul>
                </div>
              </div>
              <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                <Download size={18} /> Download Template
              </button>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <input ref={bulkFileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload size={32} className="text-gray-400" />
                  <span className="text-gray-500 text-sm">{uploading ? 'Uploading...' : 'Click to select an Excel file'}</span>
                </label>
              </div>
              {uploadResult && (
                <div className={`rounded-xl p-4 text-sm ${uploadResult.success > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {uploadResult.success > 0 && (
                    <div className="flex flex-col gap-1">
                      <p className="flex items-center gap-2 font-medium"><Check size={16} /> Upload complete!</p>
                      <p className="text-sm ml-6">{uploadResult.created} new product(s) created, {uploadResult.updated} existing product(s) updated.</p>
                    </div>
                  )}
                  {uploadResult.errors.length > 0 && <ul className="mt-2 list-disc list-inside text-xs">{uploadResult.errors.map((err, i) => <li key={i}>{err}</li>)}</ul>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

{showZipUploadModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-[440px] p-5">

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Upload ZIP Images
      </h2>

      <div className="py-4 space-y-3">

  <div>
    <p className="text-xs text-gray-500 uppercase">ZIP File</p>
    <p className="font-medium text-gray-800">
      {zipUpload.fileName || "-"}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500 uppercase">Images Found</p>
    <p className="font-medium text-gray-800">
      {zipUpload.total}
    </p>
  </div>

{!zipUpload.completed && (
  <div>
    <p className="text-xs text-gray-500 uppercase">
      Current File
    </p>

    <p className="font-medium text-gray-800 break-all">
      {zipUpload.currentFile || "Preparing..."}
    </p>
  </div>
)}

  <div className="text-center pt-4">
    <div className="text-5xl mb-3">
  {zipUpload.completed ? "✅" : "📦"}
</div>

  <p className="text-lg font-semibold text-gray-800">
  {zipUpload.completed
    ? "Upload Completed!"
    : zipUpload.currentFile
      ? `Uploading ${zipUpload.uploaded} / ${zipUpload.total}`
      : "Preparing Upload..."}
</p>
  </div>

<div className="w-full bg-gray-200 rounded-full h-3 mt-4">
  <div
    className="bg-green-600 h-3 rounded-full transition-all duration-300"
    style={{ width: `${zipUpload.progress}%` }}
  />
</div>

<p className="text-sm text-center text-gray-500 mt-2">
  {
  Math.round(
    ((zipUpload.uploaded + zipUpload.failed) /
      zipUpload.total) * 100
  )
}%
</p>

<p className="text-center text-gray-700 mt-4 font-medium">
  Success: {zipUpload.uploaded}
</p>

<p className="text-center text-red-600 font-medium mt-1">
  Failed: {zipUpload.failed}
</p>

<p className="text-center text-gray-500 text-sm mt-1">
  {zipUpload.currentFile}
</p>

{zipUpload.completed && (
  <div className="mt-6 flex justify-center">
    <button
  onClick={() => {
    setShowZipUploadModal(false);

    setZipUpload({
      fileName: "",
      total: 0,
      uploaded: 0,
      failed: 0,
      currentFile: "",
      progress: 0,
      completed: false,
      errors: [],
    });
  }}
  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
>
  Close
</button>
  </div>
)}

</div>

    </div>

  </div>
)}

<input
  ref={zipInputRef}
  type="file"
  accept=".zip"
  style={{ display: "none" }}
  onChange={handleZipSelect}
/>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete this product?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
