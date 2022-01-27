# You should now be able to run neural-style in CPU mode like this:
# th neural_style.lua -gpu -1 -print_iter 1

# Usage:
# th neural_style.lua -gpu -1 -print_iter 1 -style_image imagepathfilename1.jpg -content_image imagepathfilename2.jpg -output_image profile.png -num_iterations 100 -seed 123 -content_weight 10 -style_weight 1000 -image_size 512 -optimizer adam

CL=th neural_style.lua -gpu -1 -print_iter 1 -style_image $1 -content_image $2 -output_image $3 -num_iterations $4 -seed 123 -content_weight 10 -style_weight 1000 -image_size 512 -optimizer adam
echo "mixing... $CL"
$CL
ES=$?
echo "mixing completed with exit status $ES"
exit $ES

If everything is working properly you should see output like this:

[libprotobuf WARNING google/protobuf/io/coded_stream.cc:505] Reading dangerously large protocol message.  If the message turns out to be larger than 1073741824 bytes, parsing will be halted for security reasons.  To increase the limit (or to disable these warnings), see CodedInputStream::SetTotalBytesLimit() in google/protobuf/io/coded_stream.h.
[libprotobuf WARNING google/protobuf/io/coded_stream.cc:78] The total number of bytes read was 574671192
Successfully loaded models/VGG_ILSVRC_19_layers.caffemodel
conv1_1: 64 3 3 3
conv1_2: 64 64 3 3
conv2_1: 128 64 3 3
conv2_2: 128 128 3 3
conv3_1: 256 128 3 3
conv3_2: 256 256 3 3
conv3_3: 256 256 3 3
conv3_4: 256 256 3 3
conv4_1: 512 256 3 3
conv4_2: 512 512 3 3
conv4_3: 512 512 3 3
conv4_4: 512 512 3 3
conv5_1: 512 512 3 3
conv5_2: 512 512 3 3
conv5_3: 512 512 3 3
conv5_4: 512 512 3 3
fc6: 1 1 25088 4096
fc7: 1 1 4096 4096
fc8: 1 1 4096 1000
WARNING: Skipping content loss	
Iteration 1 / 1000	
  Content 1 loss: 2091178.593750	
  Style 1 loss: 30021.292114	
  Style 2 loss: 700349.560547	
  Style 3 loss: 153033.203125	
  Style 4 loss: 12404635.156250	
  Style 5 loss: 656.860304	
  Total loss: 15379874.666090	
Iteration 2 / 1000	
  Content 1 loss: 2091177.343750	
  Style 1 loss: 30021.292114	
  Style 2 loss: 700349.560547	
  Style 3 loss: 153033.203125	
  Style 4 loss: 12404633.593750	
  Style 5 loss: 656.860304	
  Total loss: 15379871.853590	
