import { DataSource } from "typeorm";
import { Service } from "../../entities/service.entity";

export class ServiceSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const serviceRepository = dataSource.getRepository(Service);

    const services = [
      { name: 'Limpeza Doméstica' },
      { name: 'Jardinagem' },
      { name: 'Pintura' },
      { name: 'Eletricista' },
      { name: 'Encanador' },
      { name: 'Carpinteiro' },
      { name: 'Pedreiro' },
      { name: 'Diarista' },
      { name: 'Cozinheiro' },
      { name: 'Motorista' },
      { name: 'Cuidador de Idosos' },
      { name: 'Babá' },
      { name: 'Personal Trainer' },
      { name: 'Professor Particular' },
      { name: 'Técnico em Informática' },
    ];

    for (const serviceData of services) {
      const existingService = await serviceRepository.findOne({
        where: { name: serviceData.name }
      });

      if (!existingService) {
        const service = serviceRepository.create(serviceData);
        await serviceRepository.save(service);
        console.log(`✅ Service criado: ${serviceData.name}`);
      } else {
        console.log(`⚠️  Service já existe: ${serviceData.name}`);
      }
    }
  }
}
