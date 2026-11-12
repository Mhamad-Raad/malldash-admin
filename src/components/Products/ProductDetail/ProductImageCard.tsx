import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, X, Store, Tag } from 'lucide-react';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchCategories } from '@/data/Categories';
import { useTranslation } from 'react-i18next';
import { compressImage } from '@/lib/imageCompression';

interface ProductImageCardProps {
  name: string;
  vendorName?: string;
  productId?: string;
  price?: string;
  discountPrice?: string;
  imageFile: File | null;
  imagePreview: string;
  description: string;
  categoryName: string;
  onNameChange: (name: string) => void;
  onImageChange: (file: File | null) => void;
  onImagePreviewChange: (preview: string) => void;
  onDescriptionChange: (description: string) => void;
  onCategoryChange: (categoryId: number, categoryName: string) => void;
  originalImageUrl?: string;
}

const ProductImageCard = ({
  name,
  vendorName,
  productId,
  price,
  discountPrice,
  imageFile,
  imagePreview,
  description,
  categoryName,
  onNameChange,
  onImageChange,
  onImagePreviewChange,
  onDescriptionChange,
  onCategoryChange,
  originalImageUrl,
}: ProductImageCardProps) => {
  const { t } = useTranslation('products');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      onImagePreviewChange(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(imagePreview || '');
    }
  }, [imageFile, imagePreview]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      try {
        const compressed = await compressImage(file);
        onImageChange(compressed);
      } catch (error) {
        console.error('Image compression failed:', error);
        onImageChange(file);
      }
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onImagePreviewChange(originalImageUrl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadCategories = useCallback(async (query: string) => {
    const res = await fetchCategories({ searchName: query, limit: 10 });
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((c: any) => ({ id: c.id, name: c.name }));
    }
    return [];
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('productDetail.imageCard.title')}</CardTitle>
        <CardDescription>{t('productDetail.imageCard.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Large Product Image */}
          <div className='w-full lg:w-80 shrink-0'>
            <div className='aspect-square w-full max-w-80 mx-auto lg:mx-0 rounded-xl relative'>
              <input
                ref={fileInputRef}
                id='product-photo'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
              <label
                htmlFor='product-photo'
                className='w-full h-full rounded-xl bg-muted/30 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group'
              >
                {preview ? (
                  <img
                    src={preview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex flex-col items-center gap-3'>
                    <ImageIcon className='size-16 text-muted-foreground/50 group-hover:text-primary/70 transition-colors' />
                    <span className='text-sm text-muted-foreground'>
                      {t('productDetail.imageCard.uploadImage')}
                    </span>
                  </div>
                )}
              </label>
              {preview && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage();
                  }}
                  className='absolute -top-2 -right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg z-10'
                >
                  <X className='size-4' />
                </button>
              )}
            </div>
            {imageFile && (
              <p className='text-xs text-muted-foreground text-center mt-2'>
                {t('productDetail.imageCard.newImage')} {imageFile.name}
              </p>
            )}
          </div>

          {/* All Product Details */}
          <div className='flex-1 space-y-5'>
            {/* Product Name */}
            <div className='space-y-2'>
              <Label htmlFor='productName' className='text-sm font-medium'>
                {t('productDetail.imageCard.productName')} <span className='text-destructive'>{t('productDetail.imageCard.required')}</span>
              </Label>
              <Input
                id='productName'
                placeholder={t('productDetail.imageCard.productNamePlaceholder')}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className='h-10'
              />
            </div>

            {/* Vendor & Price Info Grid */}
            <div className='grid grid-cols-2 gap-3'>
              {/* Vendor Info */}
              {vendorName && (
                <div className='p-3 rounded-lg border bg-card space-y-1'>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <Store className='w-3.5 h-3.5' />
                    <span>{t('productDetail.imageCard.vendor')}</span>
                  </div>
                  <div className='font-medium text-sm'>{vendorName}</div>
                </div>
              )}
              
              {/* Product ID */}
              {productId && (
                <div className='p-3 rounded-lg border bg-card space-y-1'>
                  <div className='text-xs text-muted-foreground'>{t('productDetail.imageCard.productId')}</div>
                  <div className='font-mono text-sm font-medium'>#{productId}</div>
                </div>
              )}
            </div>

            {/* Price Display */}
            {price && (
              <div className='p-4 rounded-lg border-2 bg-accent/5'>
                {discountPrice && parseFloat(discountPrice) > 0 ? (
                  <>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-muted-foreground'>{t('productDetail.imageCard.price')}</span>
                      <Badge variant='destructive' className='text-xs'>
                        {Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100)}% {t('productDetail.imageCard.off')}
                      </Badge>
                    </div>
                    <div className='flex items-baseline gap-3'>
                      <span className='text-3xl font-bold text-accent-foreground'>
                        ${parseFloat(discountPrice).toFixed(2)}
                      </span>
                      <span className='text-lg text-muted-foreground line-through'>
                        ${parseFloat(price).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-sm text-muted-foreground mb-2'>{t('productDetail.imageCard.price')}</div>
                    <span className='text-3xl font-bold'>
                      ${parseFloat(price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Category */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium flex items-center gap-2'>
                <Tag className='size-3.5 text-primary' />
                {t('productDetail.imageCard.category')} <span className='text-destructive'>{t('productDetail.imageCard.required')}</span>
              </Label>
              <div className='relative z-20'>
                <ObjectAutoComplete
                  fetchOptions={loadCategories}
                  onSelectOption={(option) => {
                    onCategoryChange(option.id, option.name);
                  }}
                  getOptionLabel={(c) => c.name}
                  placeholder={t('productDetail.imageCard.categoryPlaceholder')}
                  initialValue={categoryName}
                />
              </div>
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label htmlFor='description' className='text-sm font-medium'>
                {t('productDetail.imageCard.description')}
              </Label>
              <Textarea
                id='description'
                placeholder={t('productDetail.imageCard.descriptionPlaceholder')}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={3}
                className='resize-none'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImageCard;
