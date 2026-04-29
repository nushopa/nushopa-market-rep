export interface SelectOption {
  value: string;
  label: string;
  name?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  userName?: string;
}


export interface ProfileFormData {
  profilePicture: File | null;
  dateOfBirth: string;
  city: string;
  address: string;
  state: string;
  idType: string;
  proofOfId: File | null;
  userName?: string;
}

export interface ProfileFormErrors {
  profilePicture?: string;
  dateOfBirth?: string;
  city?: string;
  address?: string;
  state?: string;
  idType?: string;
  proofOfId?: string;
}