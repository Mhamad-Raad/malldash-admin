import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import ProductDetailHeader from '@/components/Products/ProductDetail/ProductDetailHeader';
import ProductImageCard from '@/components/Products/ProductDetail/ProductImageCard';
import ProductPricingCard from '@/components/Products/ProductDetail/ProductPricingCard';
import ProductStatusCard from '@/components/Products/ProductDetail/ProductStatusCard';
import ProductDetailSkeleton from '@/components/Products/ProductDetail/ProductDetailSkeleton';
import ProductErrorCard from '@/components/Products/ProductDetail/ProductErrorCard';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';

import {
  fetchProductById,
  updateProduct,
  deleteProduct,
} from '@/data/Products';
import type { ProductType } from '@/interfaces/Products.interface';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductType | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [isWeightable, setIsWeightable] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Modal State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!product) return false;
    return (
      name !== product.name ||
      description !== (product.description || '') ||
      price !== product.price?.toString() ||
      discountPrice !== (product.discountPrice?.toString() || '') ||
      inStock !== product.inStock ||
      isWeightable !== product.isWeightable ||
      categoryId !== product.categoryId ||
      imageFile !== null
    );
  }, [
    product,
    name,
    description,
    price,
    discountPrice,
    inStock,
    isWeightable,
    categoryId,
    imageFile,
  ]);

  // Build changes list for confirmation modal
  const changes = useMemo((): ChangeDetail[] => {
    if (!product) return [];
    const changesList: ChangeDetail[] = [];

    if (name !== product.name) {
      changesList.push({
        field: t('productDetail.changeFields.name'),
        oldValue: product.name,
        newValue: name,
      });
    }

    if (description !== (product.description || '')) {
      changesList.push({
        field: t('productDetail.changeFields.description'),
        oldValue: product.description || t('productDetail.changeFields.empty'),
        newValue: description || t('productDetail.changeFields.empty'),
      });
    }

    const currentPrice = parseFloat(price);
    if (!isNaN(currentPrice) && currentPrice !== product.price) {
      changesList.push({
        field: t('productDetail.changeFields.price'),
        oldValue: `$${product.price.toFixed(2)}`,
        newValue: `$${currentPrice.toFixed(2)}`,
      });
    }

    const currentDiscount = discountPrice ? parseFloat(discountPrice) : null;
    if (currentDiscount !== product.discountPrice) {
      changesList.push({
        field: t('productDetail.changeFields.discountPrice'),
        oldValue: product.discountPrice
          ? `$${product.discountPrice.toFixed(2)}`
          : t('productDetail.changeFields.none'),
        newValue: currentDiscount ? `$${currentDiscount.toFixed(2)}` : t('productDetail.changeFields.none'),
      });
    }

    if (inStock !== product.inStock) {
      changesList.push({
        field: t('productDetail.changeFields.inStock'),
        oldValue: product.inStock ? t('productDetail.changeFields.yes') : t('productDetail.changeFields.no'),
        newValue: inStock ? t('productDetail.changeFields.yes') : t('productDetail.changeFields.no'),
      });
    }

    if (isWeightable !== product.isWeightable) {
      changesList.push({
        field: t('productDetail.changeFields.weightable'),
        oldValue: product.isWeightable ? t('productDetail.changeFields.yes') : t('productDetail.changeFields.no'),
        newValue: isWeightable ? t('productDetail.changeFields.yes') : t('productDetail.changeFields.no'),
      });
    }

    if (categoryId !== product.categoryId) {
      changesList.push({
        field: t('productDetail.changeFields.category'),
        oldValue: product.categoryName,
        newValue: categoryName,
      });
    }

    if (imageFile) {
      changesList.push({
        field: t('productDetail.changeFields.image'),
        oldValue: t('productDetail.changeFields.currentImage'),
        newValue: imageFile.name,
      });
    }

    return changesList;
  }, [
    product,
    name,
    description,
    price,
    discountPrice,
    inStock,
    isWeightable,
    categoryId,
    categoryName,
    imageFile,
  ]);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    const data = await fetchProductById(productId);
    if (data && !data.error) {
      setProduct(data);
      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(data.price?.toString() || '');
      setDiscountPrice(data.discountPrice?.toString() || '');
      setInStock(data.inStock || false);
      setIsWeightable(data.isWeightable || false);
      setCategoryId(data.categoryId);
      setCategoryName(data.categoryName);
      setImagePreview(data.productImageUrl || '');
    } else {
      setError(data?.error || t('productDetail.toasts.loadError'));
    }
    setLoading(false);
  };

  const handleToggleUpdateModal = () => {
    if (!hasChanges) return;
    setShowUpdateModal((v) => !v);
  };

  const handleToggleDeleteModal = () => setShowDeleteModal((v) => !v);

  const handleUpdateProduct = async () => {
    if (!id) return;

    if (!name || !price || !categoryId) {
      toast.error(t('productDetail.toasts.requiredFields'));
      setShowUpdateModal(false);
      return;
    }

    setShowUpdateModal(false);
    setSaving(true);

    const formData = new FormData();
    formData.append('Id', id);
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Price', price);
    formData.append('DiscountPrice', discountPrice || '0');
    formData.append('CategoryId', categoryId!.toString());
    formData.append('InStock', String(inStock));
    formData.append('IsWeightable', String(isWeightable));

    if (imageFile) {
      formData.append('ProductImageUrl', imageFile);
    } else if (product?.productImageUrl) {
      formData.append('ProductImageUrl', product.productImageUrl);
    }

    const result = await updateProduct(parseInt(id), formData);

    if (result && !result.error) {
      toast.success(t('productDetail.toasts.updateSuccess'));
      navigate('/products');
    } else {
      toast.error(result?.error || t('productDetail.toasts.updateError'));
    }
    setSaving(false);
  };

  const handleDeleteProduct = async () => {
    if (!id) return;
    const result = await deleteProduct(parseInt(id));
    if (result && !result.error) {
      toast.success(t('productDetail.toasts.deleteSuccess'));
      setShowDeleteModal(false);
      navigate('/products');
    } else {
      toast.error(result?.error || t('productDetail.toasts.deleteError'));
      setShowDeleteModal(false);
    }
  };

  if (error) return <ProductErrorCard error={error} />;
  if (loading) return <ProductDetailSkeleton />;

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        <ProductDetailHeader
          onBack={() => navigate('/products')}
          hasChanges={hasChanges}
          onDelete={handleToggleDeleteModal}
        />

        <ProductImageCard
          name={name}
          vendorName={product?.vendorName}
          productId={id}
          price={price}
          discountPrice={discountPrice}
          imageFile={imageFile}
          imagePreview={imagePreview}
          description={description}
          categoryName={categoryName}
          onNameChange={setName}
          onImageChange={setImageFile}
          onImagePreviewChange={setImagePreview}
          onDescriptionChange={setDescription}
          onCategoryChange={(catId, catName) => {
            setCategoryId(catId);
            setCategoryName(catName);
          }}
          originalImageUrl={product?.productImageUrl}
        />

        <div className='grid gap-6 lg:grid-cols-2'>
          <ProductPricingCard
            price={price}
            discountPrice={discountPrice}
            onPriceChange={setPrice}
            onDiscountPriceChange={setDiscountPrice}
          />
          <ProductStatusCard
            inStock={inStock}
            isWeightable={isWeightable}
            onInStockChange={setInStock}
            onWeightableChange={setIsWeightable}
          />
        </div>
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <button
            onClick={() => navigate('/products')}
            className='px-4 py-2 rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors'
          >
            {t('productDetail.footer.cancel')}
          </button>
          <button
            onClick={handleToggleUpdateModal}
            disabled={!hasChanges || saving}
            className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {saving ? t('productDetail.footer.saving') : t('productDetail.footer.saveChanges')}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showUpdateModal}
        title={t('productDetail.modals.update.title')}
        description={t('productDetail.modals.update.description')}
        confirmType='warning'
        confirmLabel={t('productDetail.modals.update.confirmLabel')}
        cancelLabel={t('productDetail.modals.update.cancelLabel')}
        onCancel={handleToggleUpdateModal}
        onConfirm={handleUpdateProduct}
        changes={changes}
      />

      <ConfirmModal
        open={showDeleteModal}
        title={t('productDetail.modals.delete.title')}
        description={t('productDetail.modals.delete.description')}
        warning={t('productDetail.modals.delete.warning')}
        confirmType='danger'
        confirmLabel={t('productDetail.modals.delete.confirmLabel')}
        cancelLabel={t('productDetail.modals.delete.cancelLabel')}
        onCancel={handleToggleDeleteModal}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductDetail;