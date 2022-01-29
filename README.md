# OstagramJS
A simple Neural Style Transfer webapp implemented in NextJS.

Porting from obsolete py2.7 https://github.com/jcjohnson/neural-style into https://www.digitalocean.com/community/tutorials/how-to-perform-neural-style-transfer-with-python-3-and-pytorch .

The name has been borrowed from folk songs and from this: https://github.com/SergeyMorugin/ostagram https://ostagram.me/

## Project Status

Work in progress, not yet released.

## Running this project

### Gitpod

To deploy this project to Gitpod, tap this button:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/nonlin-lin-chaos-order-etc-etal/ostagramjs)

### A hack to run on AMD ROCm (2022 Jan 28)

```sh
mkdir -pv ~/vcs && \
  sudo apt install python3.9-dev ccache ninja-build llvm-amdgpu4.3.1 rocrand4.3.1 rocblas4.3.1 hip-rocclr4.3.1 hsa-rocr-dev4.3.1 \
    rocm-dbgapi4.3.1 rocm-debug-agent4.3.1 rocm-gdb4.3.1 comgr4.3.1 hsakmt-roct4.3.1 rocminfo4.3.1 hsakmt-roct-dev4.3.1 \
    hip-base4.3.1 hip-doc4.3.1 hip-rocclr4.3.1 hip-samples4.3.1 rocm-dev4.3.1 hsa-rocr-dev4.3.1 rocm-opencl4.3.1 \
    rocprofiler-dev4.3.1 rocm-opencl-dev4.3.1 rocm-clang-ocl4.3.1 rocm-utils4.3.1 comgr4.3.1 rocm-device-libs4.3.1 \
    rocm-smi-lib4.3.1 roctracer-dev4.3.1 openmp-extras4.3.1 rocm-cmake4.3.1 hsa-amd-aqlprofile4.3.1 rocm-device-libs4.3.1 \
    rocm-dev4.3.1 rocm-cmake4.3.1 miopen-hip4.3.1 hipfft4.3.1 hipsparse4.3.1 rocprim4.3.1 hipcub4.3.1 rocthrust4.3.1 \
    rccl4.3.1 rocminfo4.3.1 && \
  virtualenv --python=python3.9 ~/vcs/ostagramjs_venv3.9 && \
  . ~/vcs/ostagramjs_venv3.9/bin/activate && \
  git clone --recursive git@github.com:pytorch/pytorch.git && cd pytorch && python tools/amd_build/build_amd.py

pip install -r requirements.txt

# This creates dist/*.whl
rocrand_DIR=/opt/rocm/rocclr/lib/cmake/rocrand ROCclr_DIR=/opt/rocm/rocclr/lib/cmake/rocclr PYTORCH_ROCM_ARCH=gfx900 \
  hip_DIR=/opt/rocm/hip/cmake/ USE_NVCC=OFF BUILD_CAFFE2_OPS=0   PATH=/usr/lib/ccache/:$PATH USE_CUDA=OFF USE_ROCM=ON DEBUG=ON python setup.py bdist_wheel

pip install dist/*.whl

# Now you can use PyTorch as usual and when you say:
#   a = torch.randn(5, 5, device="cuda"),
# it'll create a tensor on the (AMD) GPU.

# Credits: http://lernapparat.de/pytorch-rocm/
```


# Next.JS cultural layers follow

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
