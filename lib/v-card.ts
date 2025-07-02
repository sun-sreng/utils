/**
 * VCard Generator - A utility for creating vCard 4.0 format contact cards
 * Supports social media, messaging platforms, and comprehensive contact information
 */

// Types for social media and messaging platforms
interface ISocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
}

interface IMessagingPlatforms {
  telegram?: string;
  whatsapp?: string;
  messenger?: string;
  skype?: string;
  discord?: string;
}

interface IAddress {
  type?: "home" | "work" | "other";
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface VCardContact {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  organization?: string;
  title?: string;
  department?: string;
  email?: string | string[];
  phone?: string | string[];
  mobile?: string | string[];
  fax?: string | string[];
  address?: IAddress[];
  website?: string;
  birthday?: Date;
  photo?: string; // URL or base64 encoded image
  social?: ISocialMedia;
  messaging?: IMessagingPlatforms;
  categories?: string[];
  note?: string;
}

/**
 * Utility class for generating vCard 4.0 format contact cards
 */
export class VCardGenerator {
  private static readonly VCARD_VERSION = "4.0";

  // Social media platform mappings
  private static readonly SOCIAL_PLATFORMS = {
    facebook: "FACEBOOK",
    twitter: "TWITTER",
    linkedin: "LINKEDIN",
    instagram: "INSTAGRAM",
    youtube: "YOUTUBE",
    github: "GITHUB",
  } as const;

  // Messaging platform mappings
  private static readonly MESSAGING_PLATFORMS = {
    telegram: "TELEGRAM",
    whatsapp: "WHATSAPP",
    messenger: "MESSENGER",
    skype: "SKYPE",
    discord: "DISCORD",
  } as const;

  /**
   * Escapes special characters for vCard format
   * @param value - String to escape
   * @returns Escaped string safe for vCard format
   */
  private static escapeVCard(value: string): string {
    if (!value) return "";

    return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/:/g, "\\:");
  }

  /**
   * Formats a date to vCard BDAY format (YYYYMMDD)
   * @param date - Date to format
   * @returns Formatted date string
   */
  private static formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date provided");
    }
    const [isoDate] = date.toISOString().split("T");
    if (!isoDate) throw new Error("Failed to extract date from ISO string");
    return isoDate.replace(/-/g, "");
  }

  /**
   * Formats email addresses for vCard
   * @param emails - Single email or array of emails
   * @returns Array of formatted email lines
   */
  private static formatEmails(emails: string | string[]): string[] {
    if (!emails) return [];

    const emailArray = Array.isArray(emails) ? emails : [emails];
    return emailArray.filter((email) => email && typeof email === "string" && email.trim().length > 0).map((email) => `EMAIL;TYPE=INTERNET:${this.escapeVCard(email.trim())}`);
  }

  /**
   * Formats address information for vCard
   * @param address - Address object
   * @returns Formatted address line
   */
  private static formatAddress(address: IAddress): string {
    if (!address) return "";

    const type = (address.type || "work").toUpperCase();
    const parts = [
      "", // PO Box
      "", // Extended Address
      address.street || "",
      address.city || "",
      address.state || "",
      address.postalCode || "",
      address.country || "",
    ];

    return `ADR;TYPE=${type}:${parts.map((part) => this.escapeVCard(part)).join(";")}`;
  }

  /**
   * Formats social media profiles for vCard
   * @param social - Social media object
   * @returns Array of formatted social media lines
   */
  private static formatSocialMedia(social: ISocialMedia = {}): string[] {
    return Object.entries(social)
      .filter(([, url]) => url && typeof url === "string")
      .map(([platform, url]) => {
        const label = this.SOCIAL_PLATFORMS[platform as keyof typeof this.SOCIAL_PLATFORMS];
        return label ? `X-SOCIALPROFILE;TYPE=${label}:${this.escapeVCard(url.trim())}` : null;
      })
      .filter((line): line is string => line !== null);
  }

  /**
   * Formats messaging platform information for vCard
   * @param messaging - Messaging platforms object
   * @returns Array of formatted messaging lines
   */
  private static formatMessaging(messaging: IMessagingPlatforms = {}): string[] {
    return Object.entries(messaging)
      .filter(([, id]) => id && typeof id === "string")
      .map(([platform, id]) => {
        const label = this.MESSAGING_PLATFORMS[platform as keyof typeof this.MESSAGING_PLATFORMS];
        return label ? `X-${label};TYPE=USERNAME:${this.escapeVCard(id.trim())}` : null;
      })
      .filter((line): line is string => line !== null);
  }

  /**
   * Formats phone numbers for vCard
   * @param values - Phone number(s)
   * @param type - Phone type (WORK,VOICE | CELL,VOICE | FAX)
   * @returns Array of formatted phone lines
   */
  private static formatPhones(values: string | string[] | undefined, type: string): string[] {
    if (!values) return [];

    const numbers = Array.isArray(values) ? values : [values];
    return numbers.filter((number) => number && typeof number === "string" && number.trim().length > 0).map((number) => `TEL;TYPE=${type}:${this.escapeVCard(number.trim())}`);
  }

  /**
   * Formats photo data for vCard
   * @param photo - Photo URL or base64 data
   * @returns Formatted photo line or null
   */
  private static formatPhoto(photo: string): string | null {
    if (!photo || typeof photo !== "string") return null;

    const trimmedPhoto = photo.trim();

    if (trimmedPhoto.startsWith("data:image")) {
      const base64Data = trimmedPhoto.split(",")[1];
      if (!base64Data) {
        console.warn("Invalid base64 image data provided");
        return null;
      }
      return `PHOTO;ENCODING=b;TYPE=JPEG:${base64Data}`;
    } else {
      return `PHOTO;VALUE=URI:${this.escapeVCard(trimmedPhoto)}`;
    }
  }

  /**
   * Validates contact data before generating vCard
   * @param contact - Contact object to validate
   * @throws Error if contact data is invalid
   */
  private static validateContact(contact: VCardContact): void {
    if (!contact || typeof contact !== "object") {
      throw new Error("Contact data must be an object");
    }

    // At least one of these should be present
    const hasBasicInfo = contact.firstName || contact.lastName || contact.organization || contact.email;
    if (!hasBasicInfo) {
      throw new Error("Contact must have at least a name, organization, or email");
    }
  }

  /**
   * Generates a vCard 4.0 string from contact information
   * @param contact - Contact information object
   * @returns vCard formatted string
   * @throws Error if contact data is invalid
   */
  public static generate(contact: VCardContact): string {
    this.validateContact(contact);

    const vcard: string[] = ["BEGIN:VCARD", `VERSION:${this.VCARD_VERSION}`];

    // Name information
    const firstName = contact.firstName?.trim() || "";
    const lastName = contact.lastName?.trim() || "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    if (fullName) {
      vcard.push(`FN:${this.escapeVCard(fullName)}`);
      vcard.push(`N:${this.escapeVCard(lastName)};${this.escapeVCard(firstName)};;;`);
    }

    // Optional fields
    if (contact.nickname?.trim()) {
      vcard.push(`NICKNAME:${this.escapeVCard(contact.nickname.trim())}`);
    }

    if (contact.organization?.trim()) {
      const org = contact.organization.trim();
      const orgLine = contact.department?.trim() ? `${org};${contact.department.trim()}` : org;
      vcard.push(`ORG:${this.escapeVCard(orgLine)}`);
    }

    if (contact.title?.trim()) {
      vcard.push(`TITLE:${this.escapeVCard(contact.title.trim())}`);
    }

    // Contact information
    if (contact.email) {
      vcard.push(...this.formatEmails(contact.email));
    }

    vcard.push(...this.formatPhones(contact.phone, "WORK,VOICE"));
    vcard.push(...this.formatPhones(contact.mobile, "CELL,VOICE"));
    vcard.push(...this.formatPhones(contact.fax, "FAX"));

    // Address information
    if (contact.address?.length) {
      contact.address.forEach((addr) => {
        const formatted = this.formatAddress(addr);
        if (formatted) vcard.push(formatted);
      });
    }

    // Web presence
    if (contact.website?.trim()) {
      vcard.push(`URL:${this.escapeVCard(contact.website.trim())}`);
    }

    // Birthday
    if (contact.birthday) {
      try {
        vcard.push(`BDAY:${this.formatDate(contact.birthday)}`);
      } catch (error) {
        console.warn("Invalid birthday date provided:", error);
      }
    }

    // Photo
    if (contact.photo) {
      const photoLine = this.formatPhoto(contact.photo);
      if (photoLine) vcard.push(photoLine);
    }

    // Social media
    if (contact.social) {
      vcard.push(...this.formatSocialMedia(contact.social));
    }

    // Messaging platforms
    if (contact.messaging) {
      vcard.push(...this.formatMessaging(contact.messaging));
    }

    // Categories
    if (contact.categories?.length) {
      const validCategories = contact.categories
        .filter((cat) => cat && typeof cat === "string")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      if (validCategories.length > 0) {
        const cats = validCategories.map((cat) => this.escapeVCard(cat)).join(",");
        vcard.push(`CATEGORIES:${cats}`);
      }
    }

    // Note
    if (contact.note?.trim()) {
      vcard.push(`NOTE:${this.escapeVCard(contact.note.trim())}`);
    }

    vcard.push("END:VCARD");

    return vcard.join("\r\n");
  }

  /**
   * Creates a downloadable blob for the vCard
   * @param contact - Contact information
   * @returns Blob object for download
   */
  public static createDownloadBlob(contact: VCardContact): Blob {
    const vcardContent = this.generate(contact);
    return new Blob([vcardContent], {
      type: "text/vcard;charset=utf-8",
    });
  }
}

// Export types for external use
export type { IAddress, IMessagingPlatforms, ISocialMedia, VCardContact };
