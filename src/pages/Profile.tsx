import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { RootState, AppDispatch } from '@/store/store';
import { updateUser } from '@/data/Users';
import { fetchMe } from '@/store/slices/meSlice';
import ProfileOverviewCard from '@/components/Profile/ProfileOverviewCard';
import EditProfileCard from '@/components/Profile/EditProfileCard';
import { compressImage } from '@/lib/imageCompression';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: me, loading: meLoading } = useSelector(
    (state: RootState) => state.me
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (me) {
      setFormData({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        phoneNumber: me.phoneNumber || '',
      });
      setImagePreview(me.profileImageUrl || null);
    }
  }, [me]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setImageFile(compressed);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error('Image compression failed:', error);
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(me?.profileImageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!me) return;
    setLoading(true);

    const updateData: any = {
      ...formData,
      role: me.role,
    };

    if (imageFile) {
      updateData.ProfileImageUrl = imageFile;
    }

    const userId = me._id || me.id;
    if (!userId) {
      toast.error('User ID is missing');
      setLoading(false);
      return;
    }

    const response = await updateUser(userId, updateData);

    setLoading(false);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success('Profile updated successfully');
      dispatch(fetchMe());
      setImageFile(null);
    }
  };

  const handleCancel = () => {
    if (me) {
      setFormData({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        phoneNumber: me.phoneNumber || '',
      });
      setImagePreview(me.profileImageUrl || null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const hasChanges =
    me &&
    (formData.firstName !== me.firstName ||
      formData.lastName !== me.lastName ||
      formData.phoneNumber !== me.phoneNumber ||
      imageFile !== null);

  if (meLoading || !me) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-muted-foreground'>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-[calc(100vh-10rem)] flex flex-col gap-4'>
      {/* Header Section */}
      <div className='flex flex-col gap-1 shrink-0'>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
          My Profile
        </h1>
        <p className='text-muted-foreground'>
          Manage your account settings and personal information
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0'>
        <ProfileOverviewCard
          user={me}
          imagePreview={imagePreview}
          imageFile={imageFile}
          fileInputRef={fileInputRef}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        <EditProfileCard
          formData={formData}
          loading={loading}
          hasChanges={!!hasChanges}
          onChange={handleChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Profile;
