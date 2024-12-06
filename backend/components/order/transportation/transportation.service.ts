import { generateAccessKey } from "../../../libraries/utils/random";
import prisma from "../../../models";

type TransportationProviderData  = {
  providerName: string;
  contactNumber: string;
  contactEmail: string;
  shippingFee: number;
}

class Transportation {

  static async createProvider(provider: TransportationProviderData) {
    return await prisma.transportationProvider.create({
      data: {
        providerName: provider.providerName,
        contactNumber: provider.contactNumber,
        contactEmail: provider.contactEmail,
        shippingFee: provider.shippingFee,
        accessKey: generateAccessKey()
      }
    });
  }

  static async getProviderByKey(key: string) {
    return await prisma.transportationProvider.findUnique({
      where: { accessKey: key },
      select: {
        providerId: true,
        providerName: true,
        contactNumber: true,
        contactEmail: true,
        shippingFee: true
      }
    });
  }

  static async getProviderById(id: number) {
    return await prisma.transportationProvider.findUnique({
      where: { providerId: id },
      select: {
        providerId: true,
        providerName: true,
        contactNumber: true,
        contactEmail: true,
        shippingFee: true
      }
    });
  }

  static async getAllProviders() {
    return await prisma.transportationProvider.findMany({
      select: {
        providerId: true,
        providerName: true,
        contactNumber: true,
        contactEmail: true,
        shippingFee: true
      }
    });
  }

  static async updateProvider(key: string, provider: TransportationProviderData) {
    return await prisma.transportationProvider.update({
      where: { accessKey: key },
      data: {
        providerName: provider.providerName,
        contactNumber: provider.contactNumber,
        contactEmail: provider.contactEmail,
        shippingFee: provider.shippingFee
      }
    });
  }

}

export default Transportation;