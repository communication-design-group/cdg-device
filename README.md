При кожному оновленні — тег версії:  
```git tag v1.0.1```  
```git push origin v1.0.1```

Використання в застосунку:  
```
npm install git+ssh://git@github.com/communication-design-group/cdg-device.git#v1.0.0
```

```
yarn add git+ssh://git@github.com/communication-design-group/cdg-device.git#v1.0.0
```

Або в package.json:
```
"dependencies": {
  "@cdg/device": "git+ssh://git@github.com/communication-design-group/cdg-device.git#v1.0.0"
}
```

Оновлення до нової версії:  
```
npm install git+ssh://git@github.com/communication-design-group/cdg-device.git#v1.0.1
```

```
yarn add git+ssh://git@github.com/communication-design-group/cdg-device.git#v1.0.1
```