#!/bin/bash
# 推送到远程仓库

cd "/workspace"

# 设置远程仓库URL（使用GitHub Token）
git remote set-url origin "https://ghp_tHrtE8ePO4tJ6Pf24YYpkLVMV5FkhCcliRIPPdlBvO57Q55FXKXeHpucVog@github.com/hygithub-pixel/hy.git"

# 推送到远程
git push origin trae/solo-agent-mR1bbX

echo "推送完成！"
