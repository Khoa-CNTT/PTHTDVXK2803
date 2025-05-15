import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

// custom useQuery
export const useCustomQuery = <T>(queryKey: string[], queryFn: () => Promise<T>, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    ...options, // cho phép truyền thêm options
  });
};

export const useCustomNavMutation = <T, R>(
  mutationFn: (data: T) => Promise<R>,
  nav?: string,
  messageSuccess?: string,
  messageError?: string,
  options = {}
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<R, Error, T>({
    mutationFn,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(); // Làm mới dữ liệu sau khi mutation thành công
      if (nav) navigate(nav);
      toast.success(messageSuccess);
    },
    onError: (error) => {
      toast.error(messageError);
      console.error("Mutation error:", error);
    },
  });
};

export const useCustomMutation = <T, R>(
  mutationFn: (data: T) => Promise<R>,
  queryKey?: string,
  options = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<R, Error, T>({
    mutationFn,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKey}`] }); // Làm mới dữ liệu sau khi mutation thành công
      toast.success("Thành công");
    },
    onError: (error) => {
      toast.error("Thất bại");
      console.error("Mutation error:", error);
    },
  });
};
