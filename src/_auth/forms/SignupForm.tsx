import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccount, useSignInAccount,useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { INITIAL_USER, useUserContext } from "@/context/AuthContext"

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const navigate = useNavigate();

  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const { mutate: signOut } = useSignOutAccount();

  console.log(user);

  useEffect(() => {
    userReset();
  }, []);

  async function userReset() {
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
  }
  //////

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigninIn } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({ title: "Sign Up Failed, Please try again." });
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({ title: "Sign Up Failed, Please try again." });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({ title: "Sign Up Failed, Please try again." });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col ">
        <img src="/public/assets/images/logo.svg" alt="wendstagram-logo" />
        <h2 className="h3-bold md:h2-bold pt-3 sm:pt-3">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Wendsgram, please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="shad-button_primary" type="submit">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account ?{" "}
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-in"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm