![npm (scoped)](https://img.shields.io/npm/v/@react_native_libraries/react-native-network-state-listener)
![npm](https://img.shields.io/npm/dw/@react_native_libraries/react-native-network-state-listener)

# cz-jira-smart-validated

![banner](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/banner.jpeg)

## About

Padronize os commits do seu time utilizando este adapter para o commitzen.

Esse adapter torna possível especificar e validar o commit de um projeto que utilize o jira como ferramenta
de gerenciamento.

## Example

**Amostra de fluxo:**
![sampleFlow](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/commitExample.jpeg)

**Amostra do resultado da montagem do commit utilizando este adapter:**
![sampleFlow](https://raw.githubusercontent.com/react-native-libraries/cz-jira-smart-validated/main/images/expectedResult.jpeg)

## Installation

**If using yarn:**

```javascript
yarn add cz-jira-smart-validated
```

**If using npm:**

```javascript
npm i cz-jira-smart-validated
```

## Usage

**Reference it in your package.json of your project like that**

```javascript
{
    ...
 "config": {
        "commitizen": {
            "path": "./node_modules/cz-jira-smart-commit-validated",
            "disableScopeLowerCase": false,
            "disableSubjectLowerCase": false,
            "maxHeaderWidth": 100,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "defaultIssuesPrefix": "EVOLOG",
            "enableMultiIssuesIdByCommit": false
        }
    }
}
```

**Para o adapter ser disparado apenas execute**

```javascript
git cz
```

ou se preferir, é possível utilizar o [husky](https://www.npmjs.com/package/husky) para disparar o hook [prepare-commmit-msg](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks#:~:text=The%20prepare-commit,programmatically%20insert%20information.). Quando o hook for disparado apenas execute isso:

```javascript
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

**Exemplo de como ficaria o hook:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

    exec < /dev/tty && node_modules/.bin/cz --hook || true
```

## Documentation

### cz-jira-smart-validated

| Property Name               | Description                                                                                                                                                                                                                                                                                                     | Default                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| types                       | Define os tipos de mudanças que podem ser usados                                                                                                                                                                                                                                                                | [conventional-commit-types](https://github.com/commitizen/conventional-commit-types/blob/HEAD/index.json) |
| defaultType                 | Define o tipo default do commit                                                                                                                                                                                                                                                                                 | ""                                                                                                        |
| defaultScope                | Define o escopo default do commit                                                                                                                                                                                                                                                                               | ""                                                                                                        |
| defaultSubject              | Define o assunto default do commit                                                                                                                                                                                                                                                                              | ""                                                                                                        |
| defaultBody                 | Define o default body do commit                                                                                                                                                                                                                                                                                 | ""                                                                                                        |
| defaultIssuesPrefix         | Define o prefixo para os Jiras Issue IDs do projeto. Se o nome da branch começa com o defaultIssuesPrefix, o nome da branch passa a ser visto como Jira Issue ID default, supondo que o nome da branch seja EVOLOG-1234, então quando for requerido o nome das Issues, por default a Issue ID seria EVOLOG-1234 | ""                                                                                                        |
| enableMultiIssuesIdByCommit | Define se é possível ou não informar mais de uma Issue ID por commit                                                                                                                                                                                                                                            | false                                                                                                     |
| workflowOptions             | Define as opções de workflow para serem disparadas no Jira                                                                                                                                                                                                                                                      | ""                                                                                                        |
| disableScopeLowerCase       | Desabilita a passagem dos caracteres do escopo pra lowercase                                                                                                                                                                                                                                                    | false                                                                                                     |
| disableSubjectLowerCase     | Desabilita a passagem dos caracteres do titúlo do commit pra lowercase                                                                                                                                                                                                                                          | false                                                                                                     |
| maxHeaderWidth              | Define a quantidade de caracteres que o título do commit pode ter                                                                                                                                                                                                                                               | 100                                                                                                       |
| maxHeaderWidth              | Define a quantidade máxima de caracteres por linha                                                                                                                                                                                                                                                              | 100                                                                                                       |

## Contributing

Pull requests are always welcome! Feel free to open a new GitHub issue for any changes that can be made.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Author

Kalebe Samuel

## License

[MIT](./LICENSE)

---
