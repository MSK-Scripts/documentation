---
title: Class
sidebar_position: 8
---

# Class

A small class system with inheritance. A class is a plain table that also serves as the metatable of its instances, so creating an instance copies nothing and a method lookup costs one step per inheritance level.

:::info[New in v4.1.0]
`MSK.Class` has no exports. Use it through the import in your own resource.
:::

Classes work because `import.lua` compiles the module straight into your resource. The class, its instances and their methods all live in your own Lua runtime.

:::caution[Instances do not survive an export]
FiveM exports only carry plain data. An instance handed through an export arrives without its metatable and therefore without any of its methods. Keep instances inside the resource that created them and pass plain values (ids, tables of fields) across resource boundaries.
:::

## MSK.Class.New

Creates a new class, optionally inheriting from `parent`. The module is callable, so `MSK.Class(name, parent)` does the same.

**Parameters**  
**name** - `string` - Name of the class, used by `tostring`  
**parent** - `table` - Optional - A class to inherit from

**Returns**  
**class** - `table` - The new class

```lua
local class = MSK.Class.New(name, parent)

-- Example
local Vehicle = MSK.Class.New('Vehicle')

function Vehicle:init(model)
    self.model = model
end

function Vehicle:GetModel()
    return self.model
end

local vehicle = Vehicle:New('sultan')
print(vehicle:GetModel()) -- Output: sultan
print(vehicle)            -- Output: Vehicle instance
print(Vehicle)            -- Output: class Vehicle

-- Shorthand (callable module):
local Vehicle = MSK.Class('Vehicle')
```

Every class has the fields `Name` and `Parent` (the parent class or `nil`).

## Class:New

Creates an instance of the class and calls `init(self, ...)` if the class (or one of its parents) defines it. Calling the class directly, `Vehicle(...)`, does the same.

If `init` returns exactly `false`, the construction is refused and `nil` is returned. That is handy for invalid input.

**Parameters**  
**...** - `any` - Optional - Arguments passed to `init`

**Returns**  
**instance** - `table?` - The new instance, or `nil` if `init` returned `false`

```lua
local instance = Class:New(...)

-- Example
local Garage = MSK.Class.New('Garage')

function Garage:init(slots)
    if type(slots) ~= 'number' or slots < 1 then
        return false
    end

    self.slots = slots
end

local garage = Garage:New(10) -- instance
local broken = Garage(0)      -- nil
```

## Class:Extend

Creates a child class that inherits every method of this one. Metamethods such as `__eq`, `__lt` or `__add` defined on the parent are copied to the child, because Lua reads them from the metatable itself and not through `__index`. The generated `__tostring` is not copied, so a child instance prints its own class name.

**Parameters**  
**name** - `string` - Name of the child class

**Returns**  
**class** - `table` - The child class

```lua
local class = Class:Extend(name)

-- Example
local Car = Vehicle:Extend('Car')

function Car:init(model, doors)
    Car.Parent.init(self, model)
    self.doors = doors
end

local car = Car('sultan', 4)
print(car:GetModel(), car.doors) -- Output: sultan  4
```

:::warning
Call the parent through the class name, `Car.Parent.init(self, ...)`, never through `self.Parent`. `self` always resolves to the most derived class, so with three levels of inheritance `self.Parent.init` ends up calling itself until the stack overflows.
:::

## Class:IsA

Checks whether an instance or a class is `cls` or inherits from it.

**Parameters**  
**cls** - `table` - The class to check against

**Returns**  
**isA** - `boolean` - Whether it is `cls` or a child of it

```lua
local isA = instance:IsA(cls)

-- Example
car:IsA(Car)     -- true
car:IsA(Vehicle) -- true
Car:IsA(Vehicle) -- true
vehicle:IsA(Car) -- false
```

## MSK.Class.IsClass

Checks whether a value is a class created with `MSK.Class.New`.

**Parameters**  
**value** - `any` - The value to check

**Returns**  
**isClass** - `boolean` - Whether the value is a class

```lua
local isClass = MSK.Class.IsClass(value)

-- Example
MSK.Class.IsClass(Vehicle) -- true
MSK.Class.IsClass(car)     -- false
```

## MSK.Class.IsInstance

Checks whether a value is an instance (not a class) of `cls` or of one of its children.

**Parameters**  
**value** - `any` - The value to check  
**cls** - `table` - The class to check against

**Returns**  
**isInstance** - `boolean` - Whether the value is an instance of `cls`

```lua
local isInstance = MSK.Class.IsInstance(value, cls)

-- Example
MSK.Class.IsInstance(car, Vehicle) -- true
MSK.Class.IsInstance(Car, Vehicle) -- false, Car is a class
```
