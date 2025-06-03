import { Model } from "andes-lib";



export const myModel: Model = {
  project: {
    id: "MyProject",
    name: "My Awesome Project",
    description: "This is a description of my awesome project.",
    architecture: "java",
  },
  components: [
    // Adicione componentes se necessário
  ],
};

export const myTargetFolder: string = "./generated-files";

