// AES-256 Encryption Utility for Lab Report Data
// This provides client-side encryption for sensitive demographic and medical data

class LabReportEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12; // 96 bits for GCM

  // Generate a cryptographic key for AES-256
  static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt sensitive data (demographics, medical results)
  static async encryptData(data: any, key: CryptoKey): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataString = JSON.stringify(data);
      const dataBuffer = encoder.encode(dataString);

      // Generate random IV for each encryption
      const iv = window.crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        dataBuffer
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  // Decrypt sensitive data
  static async decryptData(encryptedData: string, key: CryptoKey): Promise<any> {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, this.IV_LENGTH);
      const encrypted = combined.slice(this.IV_LENGTH);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Export key for storage (encrypted with user password or secure storage)
  static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('jwk', key);
    return btoa(JSON.stringify(exported));
  }

  // Import key from storage
  static async importKey(keyData: string): Promise<CryptoKey> {
    const keyObject = JSON.parse(atob(keyData));
    return await window.crypto.subtle.importKey(
      'jwk',
      keyObject,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Hash sensitive data for indexing (one-way, for admin analytics)
  static async hashForAnalytics(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return btoa(String.fromCharCode(...hashArray));
  }

  // Secure data storage wrapper
  static async secureStore(key: string, data: any, encryptionKey: CryptoKey): Promise<void> {
    const encryptedData = await this.encryptData(data, encryptionKey);
    localStorage.setItem(`encrypted_${key}`, encryptedData);
  }

  // Secure data retrieval wrapper
  static async secureRetrieve(key: string, encryptionKey: CryptoKey): Promise<any> {
    const encryptedData = localStorage.getItem(`encrypted_${key}`);
    if (!encryptedData) return null;
    
    return await this.decryptData(encryptedData, encryptionKey);
  }

  // Clear all encrypted data
  static clearSecureStorage(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('encrypted_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default LabReportEncryption;