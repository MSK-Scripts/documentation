---
title: Client
sidebar_position: 1
---

# Client Exports

## openRadio

Opens the radio UI.

```lua
exports.msk_radio:openRadio()
```

## closeRadio

Closes the radio UI.

```lua
exports.msk_radio:closeRadio()
```

## isRadioOpen

**Returns**  
**isRadioOpen** - `boolean`

```lua
local isRadioOpen = exports.msk_radio:isRadioOpen()
```

## isEncryptedChannel

**Parameters**  
**channel** - `number` - The Channel ID

**Returns**  
**isEncryptedChannel** - `boolean`

```lua
local isEncryptedChannel = exports.msk_radio:isEncryptedChannel(1)
```

## hasChannelPassword

**Parameters**  
**channel** - `number` - The Channel ID

**Returns**  
**hasChannelPassword** - `boolean`

```lua
local hasChannelPassword = exports.msk_radio:hasChannelPassword(5)
```

## checkChannelPassword

**Parameters**  
**channel** - `number` - The Channel ID  
**password** - `string` - The Password

**Returns**  
**isPasswordCorrect** - `boolean`

```lua
local isPasswordCorrect = exports.msk_radio:checkChannelPassword(5, '1234')
```

## getRadioChannel

**Returns**  
**channel** - `number` - Current Radiochannel

```lua
local channel = exports.msk_radio:getRadioChannel()
```

## getRadioVolume

**Returns**  
**volume** - `number` - Current Radiovolume (0–100)

```lua
local volume = exports.msk_radio:getRadioVolume()
```

## setRadioChannel

**Parameters**  
**channel** - `number` - The Channel ID

```lua
exports.msk_radio:setRadioChannel(1)
```

## removeRadioChannel

**Parameters**  
**channel** - `number` - The Channel ID, optional, required for tokovoip

```lua
exports.msk_radio:removeRadioChannel()
exports.msk_radio:removeRadioChannel(5) -- tokovoip example
```

## setRadioVolume

**Parameters**  
**volume** - `number` - New volume (0–100)

```lua
exports.msk_radio:setRadioVolume(50)
```

## setRadioSpeaker

**Parameters**  
**toggle** - `boolean` - Activate/Deactivate

```lua
exports.msk_radio:setRadioSpeaker(true)
exports.msk_radio:setRadioSpeaker(false)
```
