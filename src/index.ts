import {
  AptosWalletErrorResult,
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
  PluginProvider,
} from "@aptos-labs/wallet-adapter-core";
import { TxnBuilderTypes, Types } from "aptos";

interface OolletWindow extends Window {
  oollet?: PluginProvider;
}

declare const window: OolletWindow;

export const OolletWalletName = "Oollet" as WalletName<"Oollet">;

export class OolletWallet implements AdapterPlugin {
  readonly name = OolletWalletName;
  readonly url = ""; // CHANGE url value to your chrome store or other URL
  readonly icon = // CHANGE icon value
    "data:image/png;base64,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";

  // An optional property for wallets which may have different wallet name with window property name.
  // such as window.aptosWallet and wallet name is Aptos.
  // If your wallet name prop is different than the window property name use the window property name here and comment out line 37

  // readonly providerName = "aptosWallet";

  /**
   * An optional property for wallets that supports mobile app.
   * By providing the `deeplinkProvider` prop, the adapter will redirect the user
   * from a mobile web browser to the wallet's mobile app on `connect`.
   *
   * `url` param is given by the provider and represents the current website url the user is on.
   */

  deeplinkProvider(data: { url: string }): string {
    return `oollet://explore?url=${data.url}`;
  }

  provider: PluginProvider | undefined =
    typeof window !== "undefined" ? window.oollet : undefined;

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${OolletWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${OolletWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signAndSubmitBCSTransaction(
    transaction: TxnBuilderTypes.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${OolletWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${OolletWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${OolletWalletName} Network Error`;
      return {
        name: response.name,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (
        networkName: NetworkInfo
      ): Promise<void> => {
        callback({
          name: networkName,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }
}
