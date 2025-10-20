import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditBookPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- 1. ดึง ID จาก URL

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '',
    price: ''
  });
  
  const [loading, setLoading] = useState(true); // State สำหรับดึงข้อมูล
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- 2. ดึงข้อมูลหนังสือเล่มนี้มาโชว์ในฟอร์ม ---
  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        
        // ใส่ข้อมูลที่ดึงมาลงในฟอร์ม (แปลง number เป็น string)
        setFormData({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          year: String(data.year),
          price: String(data.price)
        });
        
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  // (ฟังก์ชัน handleChange และ validateForm เหมือนเดิม)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    // (คัดลอก validateForm ทั้งหมดจาก AddBookPage มาวางตรงนี้ได้เลย)
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'กรุณากรอกชื่อหนังสือ';
    if (!formData.author.trim()) newErrors.author = 'กรุณากรอกชื่อผู้แต่ง';
    if (!formData.isbn.trim()) newErrors.isbn = 'กรุณากรอก ISBN';
    if (!formData.year) newErrors.year = 'กรุณากรอกปี';
    if (isNaN(parseInt(formData.year))) newErrors.year = 'ปีต้องเป็นตัวเลข';
    if (!formData.price) newErrors.price = 'กรุณากรอกราคา';
    if (isNaN(parseFloat(formData.price))) newErrors.price = 'ราคาต้องเป็นตัวเลข';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- 3. แก้ไข handleSubmit ให้ใช้ 'PUT' (Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      // ใช้ 'PUT' และ URL ที่มี ID
      const response = await fetch(`/api/v1/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          isbn: formData.isbn.trim(),
          year: parseInt(formData.year),
          price: parseFloat(formData.price)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      const data = await response.json();
      setSuccessMessage(`อัปเดตหนังสือ "${data.title}" สำเร็จ!`);

      // (ทางเลือก) พาผู้ใช้กลับไปหน้า List หลังอัปเดตสำเร็จ
      setTimeout(() => {
        navigate('/store-manager/list-book');
      }, 2000);

    } catch (error) {
      setErrors({ submit: 'เกิดข้อผิดพลาดในการอัปเดต: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  // --- 4. UI (เหมือน AddBookPage แต่เปลี่ยนข้อความเล็กน้อย) ---
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        กำลังโหลดข้อมูลหนังสือ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (เหมือนเดิม) */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
         {/* (คัดลอก JSX ส่วน Header จาก AddBookPage มาได้เลย) */}
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            
            {/* เปลี่ยน Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              แก้ไขหนังสือ (ID: {id})
            </h2>

            {/* (ส่วน Success/Error Message เหมือนเดิม) */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}
            {errors.submit && (
              <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Form (เหมือนเดิมทุกประการ) */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหนังสือ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ... ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้แต่ง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ... ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหนังสือ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ... ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ... ${errors.isbn ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  ราคา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ... ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* (Field อื่นๆ: ISBN, Year, Price คัดลอกมาได้เลย) */}
              {/* ... */}

              {/* Submit Button (เปลี่ยนข้อความ) */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white ... ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/store-manager/list-book')}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg ..."
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;