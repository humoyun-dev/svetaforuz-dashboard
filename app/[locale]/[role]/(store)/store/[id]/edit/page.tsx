"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/use-fetch";
import {
  Store,
  Upload,
  X,
  Save,
  ArrowLeft,
  MapPin,
  ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

interface StoreData {
  id: number;
  name: string;
  description: string;
  phone_number: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  logo: string;
  banner: string | null;
  created_at: string;
  owner: number;
}

interface FormData {
  name: string;
  description: string;
  phone_number: string;
  address: string;
  latitude: string;
  longitude: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useFetch<StoreData>(`store/${id}/`);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    phone_number: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Initialize form data when store data loads
  React.useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        description: data.description || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        latitude: data.latitude?.toString() || "",
        longitude: data.longitude?.toString() || "",
      });
      setLogoPreview(data.logo || "");
      setBannerPreview(data.banner || "");
    }
  }, [data]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (type: "logo" | "banner", file: File | null) => {
    if (type === "logo") {
      setLogoFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setLogoPreview(data?.logo || "");
      }
    } else {
      setBannerFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setBannerPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setBannerPreview(data?.banner || "");
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Store name is required";
    }

    if (
      formData.phone_number &&
      !/^\+?[\d\s\-$$$$]+$/.test(formData.phone_number)
    ) {
      newErrors.phone_number = "Please enter a valid phone number";
    }

    if (
      formData.latitude &&
      (isNaN(Number(formData.latitude)) ||
        Number(formData.latitude) < -90 ||
        Number(formData.latitude) > 90)
    ) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (
      formData.longitude &&
      (isNaN(Number(formData.longitude)) ||
        Number(formData.longitude) < -180 ||
        Number(formData.longitude) > 180)
    ) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make the actual API call to update the store
      console.log("Form data:", formData);
      console.log("Logo file:", logoFile);
      console.log("Banner file:", bannerFile);

      setSubmitStatus("success");

      // Redirect after successful update
      setTimeout(() => {
        router.push(`/store/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating store:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <div className="text-red-500 font-medium text-lg mb-2">
              Failed to load store data
            </div>
            <p className="text-gray-500 mb-4">
              Unable to edit store at this time
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Edit Store</h1>
            <p className="text-gray-600">
              Update your store information and media
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Store updated successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to update store. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Store Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter store name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone_number ? "border-red-500" : ""}
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-red-500">
                        {errors.phone_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your store..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter store address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Coordinates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      placeholder="e.g., 37.7749"
                      className={errors.latitude ? "border-red-500" : ""}
                    />
                    {errors.latitude && (
                      <p className="text-sm text-red-500">{errors.latitude}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      placeholder="e.g., -122.4194"
                      className={errors.longitude ? "border-red-500" : ""}
                    />
                    {errors.longitude && (
                      <p className="text-sm text-red-500">{errors.longitude}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Optional: Add coordinates to help customers find your store
                  location
                </p>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Store Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label className="text-base font-medium">Store Logo</Label>
                  <div className="mt-2 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <Image
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        {logoPreview && logoPreview !== data.logo && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileChange("logo", null)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended: Square image, at least 200x200px
                      </p>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange("logo", e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Banner Upload */}
                <div>
                  <Label className="text-base font-medium">Store Banner</Label>
                  <div className="mt-2">
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                      {bannerPreview ? (
                        <Image
                          src={bannerPreview || "/placeholder.svg"}
                          alt="Banner preview"
                          width={400}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No banner uploaded
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("banner-upload")?.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Banner
                      </Button>
                      {bannerPreview && bannerPreview !== data.banner && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileChange("banner", null)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: Wide image, at least 800x300px
                    </p>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("banner", e.target.files?.[0] || null)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
