import {
  fromSSO,
  fromTemporaryCredentials,
} from '@aws-sdk/credential-providers';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import {
  getSecretValue,
  getSecretWithAssumeRoleAsJson,
  getClientConfig,
} from '../../../../src/_common/aws/secrets-manager/client';

jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: jest.fn(),
  GetSecretValueCommand: jest.fn(),
}));

jest.mock('@aws-sdk/credential-providers', () => ({
  fromSSO: jest.fn(),
  fromTemporaryCredentials: jest.fn(),
}));

describe('Secrets Manager Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCredentialsRuntine', () => {
    it('debería usar fromSSO en modo desarrollo', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'development';
      process.env.AWS_SSO_PROFILE = 'test-profile';
      const mockCredentials = { accessKeyId: 'mockKey' };
      (fromSSO as jest.Mock).mockReturnValue(mockCredentials);

      const credentials = await (
        await import('../../../../src/_common/aws/secrets-manager/client')
      ).getCredentialsRuntine();

      expect(fromSSO).toHaveBeenCalledWith({ profile: 'test-profile' });
      expect(credentials).toBe(mockCredentials);
    });

    it('debería usar fromTemporaryCredentials en modo no desarrollo', async () => {
      // @ts-ignore
      process.env.NODE_ENV = 'production';
      process.env.AWS_ARN_IAM = 'mock-arn';
      process.env.AWS_REGION_SM = 'mock-region';
      const mockCredentials = { accessKeyId: 'mockKey' };
      (fromTemporaryCredentials as jest.Mock).mockReturnValue(mockCredentials);

      const credentials = await (
        await import('../../../../src/_common/aws/secrets-manager/client')
      ).getCredentialsRuntine();

      expect(fromTemporaryCredentials).toHaveBeenCalledWith({
        params: { RoleArn: 'mock-arn' },
        clientConfig: { region: 'mock-region' },
      });
      expect(credentials).toBe(mockCredentials);
    });
  });

  describe('getSecretValue', () => {
    it('debería obtener el valor del secreto y devolverlo como JSON si asJson es verdadero', async () => {
      const mockConfig = { region: 'mock-region' };
      const mockResponse = { SecretString: '{"key":"value"}' };
      const mockClient = {
        send: jest.fn().mockResolvedValue(mockResponse),
      };
      (SecretsManagerClient as jest.Mock).mockImplementation(() => mockClient);

      const result = await getSecretValue('mock-secret-id', mockConfig, true);

      expect(SecretsManagerClient).toHaveBeenCalledWith(mockConfig);
      expect(mockClient.send).toHaveBeenCalledWith(
        new GetSecretValueCommand({ SecretId: 'mock-secret-id' }),
      );
      expect(result).toEqual({ key: 'value' });
    });

    it('debería obtener el valor del secreto y devolver la respuesta sin procesar si asJson es falso', async () => {
      const mockConfig = { region: 'mock-region' };
      const mockResponse = { SecretString: '{"key":"value"}' };
      const mockClient = {
        send: jest.fn().mockResolvedValue(mockResponse),
      };
      (SecretsManagerClient as jest.Mock).mockImplementation(() => mockClient);

      const result = await getSecretValue('mock-secret-id', mockConfig, false);

      expect(result).toEqual(mockResponse);
    });

    it('debería lanzar un error si falla al obtener el secreto', async () => {
      const mockConfig = { region: 'mock-region' };
      const mockClient = {
        send: jest.fn().mockRejectedValue(new Error('Fetch error')),
      };
      (SecretsManagerClient as jest.Mock).mockImplementation(() => mockClient);

      await expect(
        getSecretValue('mock-secret-id', mockConfig, true),
      ).rejects.toThrow('Fetch error');
    });
  });

  describe('getSecretWithAssumeRoleAsJson', () => {
    it('debería obtener el secreto con un rol asumido y devolverlo como JSON', async () => {
      const mockCredentials = { accessKeyId: 'mockKey' };
      const mockConfig = {
        region: 'mock-region',
        credentials: mockCredentials,
      };
      const mockResponse = { SecretString: '{"key":"value"}' };
      const mockClient = {
        send: jest.fn().mockResolvedValue(mockResponse),
      };
      (fromTemporaryCredentials as jest.Mock).mockReturnValue(mockCredentials);
      (SecretsManagerClient as jest.Mock).mockImplementation(() => mockClient);

      const result = await getSecretWithAssumeRoleAsJson('mock-secret-id');

      expect(SecretsManagerClient).toHaveBeenCalledWith(mockConfig);
      expect(mockClient.send).toHaveBeenCalledWith(
        new GetSecretValueCommand({ SecretId: 'mock-secret-id' }),
      );
      expect(result).toEqual({
        ...mockResponse,
        SecretJson: { key: 'value' },
      });
    });

    it('debería lanzar un error si falla al obtener el secreto con un rol asumido', async () => {
      const mockCredentials = { accessKeyId: 'mockKey' };
      const mockClient = {
        send: jest.fn().mockRejectedValue(new Error('Fetch error')),
      };
      (fromTemporaryCredentials as jest.Mock).mockReturnValue(mockCredentials);
      (SecretsManagerClient as jest.Mock).mockImplementation(() => mockClient);

      await expect(
        getSecretWithAssumeRoleAsJson('mock-secret-id'),
      ).rejects.toThrow('Fetch error');
    });
  });

  describe('getClientConfig', () => {
    it('debería devolver la configuración del cliente con credenciales y región', async () => {
      const mockCredentials = { accessKeyId: 'mockKey' };
      (fromTemporaryCredentials as jest.Mock).mockReturnValue(mockCredentials);
      process.env.AWS_REGION_SM = 'mock-region';

      const config = await getClientConfig();

      expect(config).toEqual({
        region: 'mock-region',
        credentials: mockCredentials,
      });
    });
  });
});
