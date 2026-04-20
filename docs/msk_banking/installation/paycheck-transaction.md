---
title: Paycheck Transaction
sidebar_position: 2
---

# Paycheck Transaction

1. Go to `es_extended/server/paycheck.lua`
2. Replace the file with the following code

```lua title="paycheck.lua"
function StartPayCheck()
    CreateThread(function()
        while true do
            Wait(Config.PaycheckInterval)
            local xPlayers = ESX.GetExtendedPlayers()

            for _, xPlayer in pairs(xPlayers) do
                local job     = xPlayer.job.grade_name
                local onDuty  = xPlayer.job.onDuty
                local salary  = xPlayer.job.grade_salary
                local iban = exports.msk_banking:getIBANFromIdentifier(xPlayer.identifier)

                if salary > 0 then
                    if job == 'unemployed' then
                        xPlayer.addAccountMoney('bank', salary)
                        exports.msk_banking:addTransaction(iban, xPlayer.name, 'paycheck', xPlayer.job.label, salary, 'Paycheck', 'paycheck', 'main')
                        TriggerClientEvent('esx:showAdvancedNotification', xPlayer.source, _U('bank'), _U('received_paycheck'), _U('received_help', salary), 'CHAR_BANK_MAZE', 9)
                    elseif Config.EnableSocietyPayouts and onDuty then
                        TriggerEvent('esx_society:getSociety', xPlayer.job.name, function(society)
                            if society ~= nil then
                                TriggerEvent('esx_addonaccount:getSharedAccount', society.account, function(account)
                                    if account.money >= salary then
                                        xPlayer.addAccountMoney('bank', salary)
                                        account.removeMoney(salary)
                                        exports.msk_banking:addTransaction(iban, xPlayer.name, 'paycheck', xPlayer.job.label, salary, 'Paycheck', 'paycheck', 'main')
                                        TriggerClientEvent('esx:showAdvancedNotification', xPlayer.source, _U('bank'), _U('received_paycheck'), _U('received_salary', salary), 'CHAR_BANK_MAZE', 9)
                                    else
                                        TriggerClientEvent('esx:showAdvancedNotification', xPlayer.source, _U('bank'), '', _U('company_nomoney'), 'CHAR_BANK_MAZE', 1)
                                    end
                                end)
                            else
                                xPlayer.addAccountMoney('bank', salary)
                                exports.msk_banking:addTransaction(iban, xPlayer.name, 'paycheck', xPlayer.job.label, salary, 'Paycheck', 'paycheck', 'main')
                                TriggerClientEvent('esx:showAdvancedNotification', xPlayer.source, _U('bank'), _U('received_paycheck'), _U('received_salary', salary), 'CHAR_BANK_MAZE', 9)
                            end
                        end)
                    elseif onDuty then
                        xPlayer.addAccountMoney('bank', salary)
                        exports.msk_banking:addTransaction(iban, xPlayer.name, 'paycheck', xPlayer.job.label, salary, 'Paycheck', 'paycheck', 'main')
                        TriggerClientEvent('esx:showAdvancedNotification', xPlayer.source, _U('bank'), _U('received_paycheck'), _U('received_salary', salary), 'CHAR_BANK_MAZE', 9)
                    end
                end
            end
        end
    end)
end
```
