// deno-lint-ignore-file no-explicit-any
/**
 * Unit tests for v-card.ts
 *
 * Tests VCard generation functionality, validation, formatting methods,
 * and edge cases using Vitest testing framework.
 */

import { describe, expect, test, vi } from "vitest";

import { VCardGenerator, type IAddress, type IMessagingPlatforms, type ISocialMedia, type VCardContact } from "./v-card.ts";

describe("VCardGenerator", () => {
  describe("Basic Contact Generation", () => {
    test("should generate minimal vCard with just firstName", () => {
      const contact: VCardContact = {
        firstName: "John",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("BEGIN:VCARD");
      expect(vcard).toContain("VERSION:4.0");
      expect(vcard).toContain("FN:John");
      expect(vcard).toContain("N:;John;;;");
      expect(vcard).toContain("END:VCARD");
    });

    test("should generate vCard with full name", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: "Doe",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("FN:John Doe");
      expect(vcard).toContain("N:Doe;John;;;");
    });

    test("should generate vCard with organization only", () => {
      const contact: VCardContact = {
        organization: "ACME Corp",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ORG:ACME Corp");
      // Organization-only contacts don't have FN: or N: fields since there's no personal name
      expect(vcard).not.toMatch(/^FN:/m);
      expect(vcard).not.toMatch(/^N:/m);
    });

    test("should generate vCard with email only", () => {
      const contact: VCardContact = {
        email: "john@example.com",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@example.com");
    });
  });

  describe("Contact Validation", () => {
    test("should throw error for empty contact", () => {
      expect(() => VCardGenerator.generate({})).toThrow("Contact must have at least a name, organization, or email");
    });

    test("should throw error for null contact", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => VCardGenerator.generate(null as any)).toThrow("Contact data must be an object");
    });

    test("should throw error for non-object contact", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => VCardGenerator.generate("invalid" as any)).toThrow("Contact data must be an object");
    });

    test("should accept contact with only firstName", () => {
      const contact: VCardContact = { firstName: "John" };
      expect(() => VCardGenerator.generate(contact)).not.toThrow();
    });

    test("should accept contact with only lastName", () => {
      const contact: VCardContact = { lastName: "Doe" };
      expect(() => VCardGenerator.generate(contact)).not.toThrow();
    });

    test("should accept contact with only organization", () => {
      const contact: VCardContact = { organization: "ACME" };
      expect(() => VCardGenerator.generate(contact)).not.toThrow();
    });

    test("should accept contact with only email", () => {
      const contact: VCardContact = { email: "test@example.com" };
      expect(() => VCardGenerator.generate(contact)).not.toThrow();
    });
  });

  describe("Name Handling", () => {
    test("should handle names with special characters", () => {
      const contact: VCardContact = {
        firstName: "Jean-Pierre",
        lastName: "O'Connor",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("FN:Jean-Pierre O'Connor");
      expect(vcard).toContain("N:O'Connor;Jean-Pierre;;;");
    });

    test("should trim whitespace from names", () => {
      const contact: VCardContact = {
        firstName: "  John  ",
        lastName: "  Doe  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("FN:John Doe");
      expect(vcard).toContain("N:Doe;John;;;");
    });

    test("should handle nickname", () => {
      const contact: VCardContact = {
        firstName: "John",
        nickname: "Johnny",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("NICKNAME:Johnny");
    });

    test("should trim nickname", () => {
      const contact: VCardContact = {
        firstName: "John",
        nickname: "  Johnny  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("NICKNAME:Johnny");
    });
  });

  describe("Organization and Title", () => {
    test("should handle organization with department", () => {
      const contact: VCardContact = {
        firstName: "John",
        organization: "ACME Corp",
        department: "Engineering",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ORG:ACME Corp\\;Engineering");
    });

    test("should handle organization without department", () => {
      const contact: VCardContact = {
        firstName: "John",
        organization: "ACME Corp",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ORG:ACME Corp");
    });

    test("should handle title", () => {
      const contact: VCardContact = {
        firstName: "John",
        title: "Software Engineer",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TITLE:Software Engineer");
    });

    test("should trim organization and department", () => {
      const contact: VCardContact = {
        firstName: "John",
        organization: "  ACME Corp  ",
        department: "  Engineering  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ORG:ACME Corp\\;Engineering");
    });
  });

  describe("Email Handling", () => {
    test("should handle single email", () => {
      const contact: VCardContact = {
        firstName: "John",
        email: "john@example.com",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@example.com");
    });

    test("should handle multiple emails", () => {
      const contact: VCardContact = {
        firstName: "John",
        email: ["john@example.com", "john.doe@work.com"],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@example.com");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john.doe@work.com");
    });

    test("should filter out empty emails", () => {
      const contact: VCardContact = {
        firstName: "John",
        email: ["john@example.com", "", "  ", "valid@email.com"],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@example.com");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET:valid@email.com");
      // Count EMAIL;TYPE=INTERNET occurrences, not just "EMAIL"
      expect(vcard.split("EMAIL;TYPE=INTERNET").length - 1).toBe(2); // Only 2 email entries
    });

    test("should trim email addresses", () => {
      const contact: VCardContact = {
        firstName: "John",
        email: "  john@example.com  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@example.com");
    });
  });

  describe("Phone Number Handling", () => {
    test("should handle work phone", () => {
      const contact: VCardContact = {
        firstName: "John",
        phone: "+1-555-123-4567",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+1-555-123-4567");
    });

    test("should handle mobile phone", () => {
      const contact: VCardContact = {
        firstName: "John",
        mobile: "+1-555-987-6543",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+1-555-987-6543");
    });

    test("should handle fax", () => {
      const contact: VCardContact = {
        firstName: "John",
        fax: "+1-555-111-2222",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TEL;TYPE=FAX:+1-555-111-2222");
    });

    test("should handle multiple phone numbers of same type", () => {
      const contact: VCardContact = {
        firstName: "John",
        phone: ["+1-555-123-4567", "+1-555-789-0123"],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+1-555-123-4567");
      expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+1-555-789-0123");
    });

    test("should filter out empty phone numbers", () => {
      const contact: VCardContact = {
        firstName: "John",
        phone: ["+1-555-123-4567", "", "  "],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+1-555-123-4567");
      // Count only valid phone entries
      const phoneEntries = vcard.split("TEL;TYPE=WORK,VOICE").length - 1;
      expect(phoneEntries).toBe(1);
    });
  });

  describe("Address Handling", () => {
    test("should handle complete address", () => {
      const address: IAddress = {
        type: "work",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      };

      const contact: VCardContact = {
        firstName: "John",
        address: [address],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ADR;TYPE=WORK:;;123 Main St;New York;NY;10001;USA");
    });

    test("should handle partial address", () => {
      const address: IAddress = {
        city: "New York",
        country: "USA",
      };

      const contact: VCardContact = {
        firstName: "John",
        address: [address],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ADR;TYPE=WORK:;;;New York;;;USA");
    });

    test("should handle multiple addresses", () => {
      const addresses: IAddress[] = [
        { type: "home", city: "Home City" },
        { type: "work", city: "Work City" },
      ];

      const contact: VCardContact = {
        firstName: "John",
        address: addresses,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ADR;TYPE=HOME:;;;Home City;;;");
      expect(vcard).toContain("ADR;TYPE=WORK:;;;Work City;;;");
    });

    test("should default address type to work", () => {
      const address: IAddress = {
        city: "New York",
      };

      const contact: VCardContact = {
        firstName: "John",
        address: [address],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ADR;TYPE=WORK:");
    });
  });

  describe("Social Media Handling", () => {
    test("should handle all social media platforms", () => {
      const social: ISocialMedia = {
        facebook: "https://facebook.com/john",
        twitter: "https://twitter.com/john",
        linkedin: "https://linkedin.com/in/john",
        instagram: "https://instagram.com/john",
        youtube: "https://youtube.com/john",
        github: "https://github.com/john",
      };

      const contact: VCardContact = {
        firstName: "John",
        social,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=FACEBOOK:https\\://facebook.com/john");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=TWITTER:https\\://twitter.com/john");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=LINKEDIN:https\\://linkedin.com/in/john");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=INSTAGRAM:https\\://instagram.com/john");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=YOUTUBE:https\\://youtube.com/john");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=GITHUB:https\\://github.com/john");
    });

    test("should filter out empty social media entries", () => {
      const social: ISocialMedia = {
        facebook: "https://facebook.com/john",
        twitter: "",
        linkedin: undefined,
      };

      const contact: VCardContact = {
        firstName: "John",
        social,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=FACEBOOK:https\\://facebook.com/john");
      expect(vcard).not.toContain("X-SOCIALPROFILE;TYPE=TWITTER:");
      expect(vcard).not.toContain("X-SOCIALPROFILE;TYPE=LINKEDIN:");
    });

    test("should trim social media URLs", () => {
      const social: ISocialMedia = {
        facebook: "  https://facebook.com/john  ",
      };

      const contact: VCardContact = {
        firstName: "John",
        social,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=FACEBOOK:https\\://facebook.com/john");
    });
  });

  describe("Messaging Platforms Handling", () => {
    test("should handle all messaging platforms", () => {
      const messaging: IMessagingPlatforms = {
        telegram: "@johndoe",
        whatsapp: "+1234567890",
        messenger: "john.doe",
        skype: "john.doe.skype",
        discord: "john#1234",
      };

      const contact: VCardContact = {
        firstName: "John",
        messaging,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("X-TELEGRAM;TYPE=USERNAME:@johndoe");
      expect(vcard).toContain("X-WHATSAPP;TYPE=USERNAME:+1234567890");
      expect(vcard).toContain("X-MESSENGER;TYPE=USERNAME:john.doe");
      expect(vcard).toContain("X-SKYPE;TYPE=USERNAME:john.doe.skype");
      expect(vcard).toContain("X-DISCORD;TYPE=USERNAME:john#1234");
    });

    test("should filter out empty messaging entries", () => {
      const messaging: IMessagingPlatforms = {
        telegram: "@johndoe",
        whatsapp: "",
        discord: undefined,
      };

      const contact: VCardContact = {
        firstName: "John",
        messaging,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("X-TELEGRAM;TYPE=USERNAME:@johndoe");
      expect(vcard).not.toContain("X-WHATSAPP;TYPE=USERNAME:");
      expect(vcard).not.toContain("X-DISCORD;TYPE=USERNAME:");
    });
  });

  describe("Date Handling", () => {
    test("should handle valid birthday", () => {
      const birthday = new Date("1990-05-15");
      const contact: VCardContact = {
        firstName: "John",
        birthday,
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("BDAY:19900515");
    });

    test("should handle invalid birthday gracefully", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const contact: VCardContact = {
        firstName: "John",
        birthday: new Date("invalid-date"),
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).not.toContain("BDAY:");
      expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid birthday date provided:", expect.any(Error));

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Photo Handling", () => {
    test("should handle photo URL", () => {
      const contact: VCardContact = {
        firstName: "John",
        photo: "https://example.com/photo.jpg",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("PHOTO;VALUE=URI:https\\://example.com/photo.jpg");
    });

    test("should handle base64 photo", () => {
      const contact: VCardContact = {
        firstName: "John",
        photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("PHOTO;ENCODING=b;TYPE=JPEG:/9j/4AAQSkZJRgABAQEAYABgAAD");
    });

    test("should handle invalid base64 photo gracefully", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const contact: VCardContact = {
        firstName: "John",
        photo: "data:image/jpeg;base64,",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).not.toContain("PHOTO:");
      expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid base64 image data provided");

      consoleWarnSpy.mockRestore();
    });

    test("should trim photo URL", () => {
      const contact: VCardContact = {
        firstName: "John",
        photo: "  https://example.com/photo.jpg  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("PHOTO;VALUE=URI:https\\://example.com/photo.jpg");
    });
  });

  describe("Categories and Notes", () => {
    test("should handle categories", () => {
      const contact: VCardContact = {
        firstName: "John",
        categories: ["work", "client", "important"],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("CATEGORIES:work,client,important");
    });

    test("should filter out empty categories", () => {
      const contact: VCardContact = {
        firstName: "John",
        categories: ["work", "", "  ", "client"],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("CATEGORIES:work,client");
    });

    test("should handle note", () => {
      const contact: VCardContact = {
        firstName: "John",
        note: "Important client contact",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("NOTE:Important client contact");
    });

    test("should trim note", () => {
      const contact: VCardContact = {
        firstName: "John",
        note: "  Important note  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("NOTE:Important note");
    });
  });

  describe("Website Handling", () => {
    test("should handle website URL", () => {
      const contact: VCardContact = {
        firstName: "John",
        website: "https://johndoe.com",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("URL:https\\://johndoe.com");
    });

    test("should trim website URL", () => {
      const contact: VCardContact = {
        firstName: "John",
        website: "  https://johndoe.com  ",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("URL:https\\://johndoe.com");
    });
  });

  describe("Special Character Escaping", () => {
    test("should escape special characters in text fields", () => {
      const contact: VCardContact = {
        firstName: "John;Test",
        lastName: "Doe,Jr",
        note: "Line 1\nLine 2\\path:value",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("FN:John\\;Test Doe\\,Jr");
      expect(vcard).toContain("N:Doe\\,Jr;John\\;Test;;;");
      expect(vcard).toContain("NOTE:Line 1\\nLine 2\\\\path\\:value");
    });

    test("should escape commas in organization", () => {
      const contact: VCardContact = {
        firstName: "John",
        organization: "ACME, Inc.",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("ORG:ACME\\, Inc.");
    });
  });

  describe("Complete vCard Structure", () => {
    test("should generate complete vCard with all fields", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: "Doe",
        nickname: "Johnny",
        organization: "ACME Corp",
        department: "Engineering",
        title: "Software Engineer",
        email: ["john@acme.com", "john.doe@gmail.com"],
        phone: "+1-555-123-4567",
        mobile: "+1-555-987-6543",
        fax: "+1-555-111-2222",
        address: [
          {
            type: "work",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "USA",
          },
        ],
        website: "https://johndoe.com",
        birthday: new Date("1990-05-15"),
        photo: "https://example.com/photo.jpg",
        social: {
          linkedin: "https://linkedin.com/in/johndoe",
          github: "https://github.com/johndoe",
        },
        messaging: {
          telegram: "@johndoe",
        },
        categories: ["work", "developer"],
        note: "Senior software engineer",
      };

      const vcard = VCardGenerator.generate(contact);

      // Check structure
      expect(vcard.startsWith("BEGIN:VCARD")).toBe(true);
      expect(vcard.endsWith("END:VCARD")).toBe(true);
      expect(vcard).toContain("VERSION:4.0");

      // Check all fields are present
      expect(vcard).toContain("FN:John Doe");
      expect(vcard).toContain("N:Doe;John;;;");
      expect(vcard).toContain("NICKNAME:Johnny");
      expect(vcard).toContain("ORG:ACME Corp\\;Engineering");
      expect(vcard).toContain("TITLE:Software Engineer");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john@acme.com");
      expect(vcard).toContain("EMAIL;TYPE=INTERNET:john.doe@gmail.com");
      expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+1-555-123-4567");
      expect(vcard).toContain("TEL;TYPE=CELL,VOICE:+1-555-987-6543");
      expect(vcard).toContain("TEL;TYPE=FAX:+1-555-111-2222");
      expect(vcard).toContain("ADR;TYPE=WORK:;;123 Main St;New York;NY;10001;USA");
      expect(vcard).toContain("URL:https\\://johndoe.com");
      expect(vcard).toContain("BDAY:19900515");
      expect(vcard).toContain("PHOTO;VALUE=URI:https\\://example.com/photo.jpg");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=LINKEDIN:https\\://linkedin.com/in/johndoe");
      expect(vcard).toContain("X-SOCIALPROFILE;TYPE=GITHUB:https\\://github.com/johndoe");
      expect(vcard).toContain("X-TELEGRAM;TYPE=USERNAME:@johndoe");
      expect(vcard).toContain("CATEGORIES:work,developer");
      expect(vcard).toContain("NOTE:Senior software engineer");
    });

    test("should use CRLF line endings", () => {
      const contact: VCardContact = {
        firstName: "John",
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard.includes("\r\n")).toBe(true);
      expect(vcard.split("\r\n").length).toBeGreaterThan(1);
    });
  });

  describe("createDownloadBlob", () => {
    test("should create blob with correct content type", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: "Doe",
      };

      const blob = VCardGenerator.createDownloadBlob(contact);

      expect(blob.type).toBe("text/vcard;charset=utf-8");
    });

    test("should create blob with vCard content", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: "Doe",
      };

      const blob = VCardGenerator.createDownloadBlob(contact);

      // In Node.js environment, we can test the blob creation without reading content
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    test("should use name-based filename by default", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: "Doe",
      };

      // The filename logic is internal, but we can test that it doesn't throw
      expect(() => VCardGenerator.createDownloadBlob(contact)).not.toThrow();
    });

    test("should handle contact with organization name", () => {
      const contact: VCardContact = {
        organization: "ACME Corp",
      };

      expect(() => VCardGenerator.createDownloadBlob(contact)).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    test("should handle undefined and null values gracefully", () => {
      const contact: VCardContact = {
        firstName: "John",
        lastName: undefined,
        email: undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phone: null as any,
        address: undefined,
        social: undefined,
      };

      expect(() => VCardGenerator.generate(contact)).not.toThrow();

      const vcard = VCardGenerator.generate(contact);
      expect(vcard).toContain("FN:John");
    });

    test("should handle empty arrays", () => {
      const contact: VCardContact = {
        firstName: "John",
        email: [],
        phone: [],
        address: [],
        categories: [],
      };

      const vcard = VCardGenerator.generate(contact);

      expect(vcard).toContain("FN:John");
      expect(vcard).not.toContain("EMAIL:");
      expect(vcard).not.toContain("TEL:");
      expect(vcard).not.toContain("ADR:");
      expect(vcard).not.toContain("CATEGORIES:");
    });

    test("should handle very long field values", () => {
      const longString = "A".repeat(1000);
      const contact: VCardContact = {
        firstName: "John",
        note: longString,
      };

      expect(() => VCardGenerator.generate(contact)).not.toThrow();

      const vcard = VCardGenerator.generate(contact);
      expect(vcard).toContain(`NOTE:${longString}`);
    });
  });
});
